import { db } from "@/db/db";
import { SaleItem, SaleRequestBody } from "@/types/types";
import { generateSaleNumber } from "@/utils/generateSaleNumber";
import { Request, Response } from "express";

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
      transactionCode,
      saleItems,
    }: SaleRequestBody = req.body;

    const saleId = await db.$transaction(async (transaction) => {
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
