import { db } from "@/db/db";
import { isValidObjectId } from "@/utils/isValidObjectId";
import { Request, Response } from "express";

export async function getExpenses(req: Request, res: Response) {
  try {
    const expenses = await db.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: expenses,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isValidObjectId(id) === false) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }
    const expense = await db.expense.findUnique({
      where: {
        id: id,
      },
    });

    if (!expense) {
      return res
        .status(404)
        .json({ error: "Expense not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: expense,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const {
      title,
      amount,
      description,
      attachments,
      expenseDate,
      payeeId,
      categoryId,
      shopId,
    } = req.body;

    const newExpense = await db.expense.create({
      data: {
        title: title,
        amount: amount,
        description: description,
        attachments: attachments,
        expenseDate: expenseDate,
        payeeId: payeeId,
        categoryId: categoryId,
        shopId: shopId,
      },
    });

    return res.status(201).json({
      error: null,
      data: newExpense,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }
    const {
      title,
      amount,
      description,
      attachments,
      expenseDate,
      payeeId,
      categoryId,
      shopId,
    } = req.body;

    const existExpense = await db.expense.findUnique({
      where: {
        id,
      },
    });
    if (!existExpense) {
      return res.status(404).json({
        error: `Expense is not found  !!!`,
        data: null,
      });
    }

    const updatedExpense = await db.expense.update({
      where: {
        id,
      },
      data: {
        title,
        amount,
        description,
        attachments,
        expenseDate,
        payeeId,
        categoryId,
        shopId,
      },
    });

    return res.status(200).json({
      error: null,
      data: updatedExpense,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }

    const existExpense = await db.expense.findUnique({
      where: {
        id,
      },
    });
    if (!existExpense) {
      return res.status(404).json({
        error: `Expense is not found  !!!`,
        data: null,
      });
    }

    await db.expense.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      error: null,
      message: "Expense deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
