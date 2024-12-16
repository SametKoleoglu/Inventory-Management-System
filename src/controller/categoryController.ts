import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: categories,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const category = await db.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!category) {
      return res
        .status(404)
        .json({ error: "Category not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: category,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const { name, slug } = req.body;

    const existCategory = await db.category.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existCategory) {
      return res.status(409).json({
        error: `Category (${name}) is already existing !!!`,
        data: null,
      });
    }

    const newCategory = await db.category.create({
      data: {
        name: name,
        slug: slug,
      },
    });

    return res.status(201).json({
      error: null,
      data: newCategory,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existCategory = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!existCategory) {
      return res.status(404).json({
        error: `Category is not found  !!!`,
        data: null,
      });
    }

    if (name !== existCategory.name) {
      const existCategoryByName = await db.category.findUnique({
        where: {
          name,
        },
      });
      if (existCategoryByName) {
        return res.status(409).json({
          error: `Category "(${name})" name is Already existing !!!`,
          data: null,
        });
      }
    }

    if (slug !== existCategory.slug) {
      const existCategoryBySlug = await db.category.findUnique({
        where: {
          slug: slug,
        },
      });
      if (existCategoryBySlug) {
        return res.status(409).json({
          error: `Category "(${slug})" slug is Already existing !!!`,
          data: null,
        });
      }
    }

    const updatedCategory = await db.category.update({
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
      data: updatedCategory,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const existCategory = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!existCategory) {
      return res.status(404).json({
        error: `Category is not found  !!!`,
        data: null,
      });
    }

    await db.category.delete({
      where: {
        id,
      },
    });

    return res.status(204).json({
      error: null,
      message: "Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
