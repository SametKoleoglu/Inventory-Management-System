import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createProduct(req: Request, res: Response) {
  try {
    const {
      name,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyingPrice,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
      wholesalePrice,
      shopId,
    } = req.body;

    const existProductBySlug = await db.product.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existProductBySlug) {
      return res.status(409).json({
        error: `Product "(${slug})" slug is already existing !!!`,
        data: null,
      });
    }

    const existProductBySKU = await db.product.findUnique({
      where: {
        sku: sku,
      },
    });
    if (existProductBySKU) {
      return res.status(409).json({
        error: `Product "(${sku})" sku is already existing !!!`,
        data: null,
      });
    }

    const existProductByProductCode = await db.product.findUnique({
      where: {
        productCode: productCode,
      },
    });
    if (existProductByProductCode) {
      return res.status(409).json({
        error: `This product code -> "(${productCode})"  is already existing !!!`,
        data: null,
      });
    }

    if (barCode) {
      const existProductByBarCode = await db.product.findUnique({
        where: {
          barCode: barCode,
        },
      });
      if (existProductByBarCode) {
        return res.status(409).json({
          error: `Product "(${barCode})" Bar Code is already existing !!!`,
          data: null,
        });
      }
    }

    const newProduct = await db.product.create({
      data: {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        wholesalePrice,
        shopId,
      },
    });

    return res.status(201).json({
      error: null,
      data: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyingPrice,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
      wholesalePrice,
      shopId,
    } = req.body;

    const existProduct = await db.product.findUnique({
      where: {
        id: id,
      },
    });
    if (!existProduct) {
      return res.status(404).json({
        error: `Product is not found !!!`,
        data: null,
      });
    }

    if (slug !== existProduct.slug) {
      const existProductBySlug = await db.product.findUnique({
        where: {
          slug: slug,
        },
      });
      if (existProductBySlug) {
        return res.status(409).json({
          error: `Product "(${slug})" slug is already existing !!!`,
          data: null,
        });
      }
    }

    if (sku !== existProduct.sku) {
      const existProductBySKU = await db.product.findUnique({
        where: {
          sku: sku,
        },
      });
      if (existProductBySKU) {
        return res.status(409).json({
          error: `Product "(${sku})" sku is already existing !!!`,
          data: null,
        });
      }
    }

    if (productCode !== existProduct.productCode) {
      const existProductByProductCode = await db.product.findUnique({
        where: {
          productCode: productCode,
        },
      });
      if (existProductByProductCode) {
        return res.status(409).json({
          error: `This product code -> "(${sku})"  is already existing !!!`,
          data: null,
        });
      }
    }

    if (barCode && barCode !== existProduct.barCode) {
      const existProductByBarCode = await db.product.findUnique({
        where: {
          barCode: barCode,
        },
      });
      if (existProductByBarCode) {
        return res.status(409).json({
          error: `Product "(${barCode})" Bar Code is already existing !!!`,
          data: null,
        });
      }
    }

    const updatedProduct = await db.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        wholesalePrice,
        shopId,
      },
    });

    return res.status(200).json({
      error: null,
      data: updatedProduct,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ error: "Product not found !!!", data: null });
    }

    await db.product.delete({
      where: {
        id: id,
      },
    });

    res.status(204).json({
      error: null,
      message: "Product Deleted Successfully !",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
