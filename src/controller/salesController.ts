import { db } from "@/db/db";
import { Request, Response } from "express";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

// LOCALE DEFINITIONS
import { SaleItem, SaleRequestBody } from "@/types/types";
import { generateSaleNumber } from "@/utils/generateSaleNumber";
import { isValidObjectId } from "@/utils/isValidObjectId";

export async function getSales(req: Request, res: Response) {
  try {
    const sales = await db.sale.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        saleItems: true,
      },
    });

    res.status(200).json({
      error: null,
      data: sales,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getSale(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const sale = await db.sale.findUnique({
      where: {
        id: id,
      },
    });

    if (!sale) {
      return res.status(404).json({ error: "Brand not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: sale,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createSale(req: Request, res: Response) {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      saleAmount,
      balanceAmount,
      paidAmount,
      saleType,
      paymentMethod,
      shopId,
      transactionCode,
      saleItems,
    }: SaleRequestBody = req.body;

    const saleId = await db.$transaction(async (transaction) => {
      // Create the Sale 100,000 => 30000
      if (balanceAmount > 0) {
        // IF the Customer is allowed to take credit

        const existingCustomer = await transaction.customer.findUnique({
          where: {
            id: customerId,
          },
        });
        if (!existingCustomer) {
          return res.status(404).json({
            error: "Customer not found",
            data: null,
          });
        }

        if (balanceAmount > existingCustomer?.maxCreditLimit) {
          return res.status(403).json({
            error: `This Customer is Not Eligible for this Credit ${balanceAmount}`,
            data: null,
          });
        }

        // Update the Customer unpaidAmount
        // Update the Customer MaxCredit Amount
        const updatedCustomer = await transaction.customer.update({
          where: {
            id: customerId,
          },
          data: {
            unpaidCreditAmount:
              existingCustomer.unpaidCreditAmount + balanceAmount,
            maxCreditLimit: {
              decrement: balanceAmount,
            },
          },
        });

        if (!updatedCustomer) {
          return res
            .json({
              error: "Failed to Update Product Quantity",
              data: null,
            })
            .status(500);
        }
      }
      const sale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          customerEmail,
          paymentMethod,
          saleNumber: generateSaleNumber(),
          saleAmount,
          saleType,
          balanceAmount,
          paidAmount,
          transactionCode,
          shopId,
        },
      });

      if (saleItems && saleItems.length > 0) {
        for (const item of saleItems) {
          // Update Product Stock Quantity
          const updatedProduct = await transaction.product.update({
            where: {
              id: item.productId,
            },
            data: {
              stockQty: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            // throw new Error(
            //   `Failed to update stock for product ID : ${item.productId}`
            // );
            return res
              .json({
                error: "Failed to Update Product Quantity",
                data: null,
              })
              .status(500);
          }

          // Create Sale Item
          const saleItem = await transaction.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              qty: item.qty,
              productPrice: item.productPrice,
              productName: item.productName,
              productImage: item.productImage,
            },
          });

          if (!saleItem) {
            // throw new Error(
            //   `Failed to create sale item for product ID : ${item.productId}`
            // );
            return res
              .json({
                error: "Failed to Create Sale Item",
                data: null,
              })
              .status(500);
          }
        }
      }

      return sale.id;
    });

    const sale = await db.sale.findUnique({
      where: {
        id: saleId as string,
      },
      include: {
        saleItems: true,
      },
    });

    return res.status(201).json({
      error: null,
      data: sale,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createSaleItem(req: Request, res: Response) {
  try {
    const { saleId, productId, qty, productPrice, productName, productImage } =
      req.body;

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        stockQty: {
          decrement: qty,
        },
      },
    });

    const saleItem = await db.saleItem.create({
      data: {
        saleId,
        productId,
        qty,
        productPrice,
        productName,
        productImage,
      },
    });

    return res.status(201).json({
      error: null,
      data: saleItem,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getShopsSales(req: Request, res: Response) {
  // Define time periods
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    // Fetch all sales and group by shopId for different periods

    const fetchSalesData = async (startDate: Date, endDate: Date) => {
      return await db.sale.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          shopId: true,
          saleAmount: true,
          balanceAmount: true,
          paymentMethod: true,
          saleType: true,
        },
      });
    };

    const categorizeSales = (sales: any[]) => {
      return {
        totalSales: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter((sale) => sale.balanceAmount > 0),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILEMONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };

    /*
    const salesToday = await db.sale.groupBy({
      by: ["shopId"],
      _sum: {
        saleAmount: true,
      },
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const salesThisWeek = await db.sale.groupBy({
      by: ["shopId"],
      _sum: {
        saleAmount: true,
      },
      where: {
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    const salesThisMonth = await db.sale.groupBy({
      by: ["shopId"],
      _sum: {
        saleAmount: true,
      },
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    const salesAllTime = await db.sale.groupBy({
      by: ["shopId"],
      _sum: {
        saleAmount: true,
      },
    });*/

    const salesToday = await fetchSalesData(todayStart, todayEnd);
    const salesThisWeek = await fetchSalesData(weekStart, weekEnd);
    const salesThisMonth = await fetchSalesData(monthStart, monthEnd);
    const salesAllTime = await db.sale.findMany({
      select: {
        shopId: true,
        saleAmount: true,
        balanceAmount: true,
        paymentMethod: true,
        saleType: true,
      },
    });

    res.status(200).json({
      today: categorizeSales(salesToday),
      thisWeek: categorizeSales(salesThisWeek),
      thisMonth: categorizeSales(salesThisMonth),
      allTime: categorizeSales(salesAllTime),
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Something went wrong",
      data: null,
    });
  }
}

export async function getShopSales(req: Request, res: Response) {
  const shopId = req.params.id;

  // Define time periods  => Today/Weekly/Monthly/All Time
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  try {
    if (!isValidObjectId(shopId)) {
      return res.status(400).json({
        error: "Invalid Shop ID!!! Please enter a valid Shop ID",
        data: null,
      });
    }
    const existShop = await db.shop.findUnique({
      where: {
        id: shopId,
      },
    });
    if (!existShop) {
      return res.status(404).json({
        error: `${shopId} ID's Shop is not found !!!`,
        data: null,
      });
    }
    // Fetch sales for different periods
    const categorizeSales = async (sales: any[]) => {
      return {
        totalSales: sales,
        salesPaidInCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
        salesPaidInCredit: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount > 0
        ),
        salesByMobileMoney: sales.filter(
          (sale) => sale.paymentMethod === "MOBILE MONEY"
        ),
        salesByHandCash: sales.filter(
          (sale) => sale.paymentMethod === "CASH" && sale.balanceAmount <= 0
        ),
      };
    };

    // TODAY
    const salesToday = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    // WEEKLY
    const salesThisWeek = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // MONTHLY
    const salesThisMonth = await db.sale.findMany({
      where: {
        shopId,
        createdAt: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    });

    // ALL TIME
    const salesAllTime = await db.sale.findMany({
      where: {
        shopId,
      },
    });

    res.status(200).json({
      today: await categorizeSales(salesToday),
      thisWeek: await categorizeSales(salesThisWeek),
      thisMonth: await categorizeSales(salesThisMonth),
      allTime: await categorizeSales(salesAllTime),
      error: null,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      data: null,
    });
  }
}
