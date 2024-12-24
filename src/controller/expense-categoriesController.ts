import { db } from "@/db/db";
import { isValidObjectId } from "@/utils/isValidObjectId";
import { Request, Response } from "express";

export async function getExpenseCategories(req: Request, res: Response) {
  try {
    const expenseCategories = await db.expenseCategory.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: expenseCategories,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getExpenseCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isValidObjectId(id) === false) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }
    const expenseCategory = await db.expenseCategory.findUnique({
      where: {
        id: id,
      },
    });

    if (!expenseCategory) {
      return res
        .status(404)
        .json({ error: "Expense Category not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: expenseCategory,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createExpenseCategory(req: Request, res: Response) {
  try {
    const { name, slug } = req.body;

    const existExpenseCategory = await db.expenseCategory.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existExpenseCategory) {
      return res.status(409).json({
        error: `Expense Category (${name}) is already existing !!!`,
        data: null,
      });
    }

    const newExpenseCategory = await db.expenseCategory.create({
      data: {
        name: name,
        slug: slug,
      },
    });

    return res.status(201).json({
      error: null,
      data: newExpenseCategory,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updateExpenseCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    if (isValidObjectId(id) === false) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }
    const existExpenseCategory = await db.expenseCategory.findUnique({
      where: {
        id,
      },
    });
    if (!existExpenseCategory) {
      return res.status(404).json({
        error: `Expense Category is not found  !!!`,
        data: null,
      });
    }

    if (slug !== existExpenseCategory.slug) {
      const existExpenseCategoryBySlug = await db.expenseCategory.findUnique({
        where: {
          slug: slug,
        },
      });
      if (existExpenseCategoryBySlug) {
        return res.status(409).json({
          error: `Expense Category "(${slug})" slug is Already existing !!!`,
          data: null,
        });
      }
    }

    const updatedExpenseCategory = await db.expenseCategory.update({
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
      data: updatedExpenseCategory,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function deleteExpenseCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }

    const existExpenseCategory = await db.expenseCategory.findUnique({
      where: {
        id,
      },
    });
    if (!existExpenseCategory) {
      return res.status(404).json({
        error: `Expense Category is not found  !!!`,
        data: null,
      });
    }

    await db.expenseCategory.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      error: null,
      message: "Expense Category deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
