import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getBrands(req: Request, res: Response) {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: brands,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getBrand(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const brand = await db.brand.findUnique({
      where: {
        id: id,
      },
    });

    if (!brand) {
      return res.status(404).json({ error: "Brand not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: brand,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createBrand(req: Request, res: Response) {
  try {
    const { name, slug } = req.body;

    const existBrand = await db.brand.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existBrand) {
      return res
        .status(409)
        .json({ error: `Brand (${name}) is already existing !!!`, data: null });
    }

    const newBrand = await db.brand.create({
      data: {
        name: name,
        slug: slug,
      },
    });

    return res.status(201).json({
      error: null,
      data: newBrand,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updateBrand(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existBrand = await db.brand.findUnique({
      where: {
        id: id,
      },
    });
    if (!existBrand) {
      return res.status(404).json({ error: `Brand not found !!!`, data: null });
    }

    if (slug !== existBrand.slug) {
      const existBrandBySlug = await db.brand.findUnique({
        where: {
          slug: slug,
        },
      });

      if (existBrandBySlug) {
        return res.status(409).json({
          error: `Brand (${name}) is already existing !!!`,
          data: null,
        });
      }
    }

    const updatedBrand = await db.brand.update({
      where: {
        id,
      },
      data: {
        name: name,
        slug: slug,
      },
    });

    return res.status(200).json({
      error: null,
      data: updatedBrand,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function deleteBrand(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existBrand = await db.brand.findUnique({
      where: {
        id: id,
      },
    });
    if (!existBrand) {
      return res.status(404).json({ error: `Brand not found !!!`, data: null });
    }

    await db.brand.delete({
      where: {
        id: id,
      },
    });

    return res.status(204).json({
      error: null,
      message: "Brand deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
