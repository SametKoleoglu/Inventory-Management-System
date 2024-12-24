import { db } from "@/db/db";
import { isValidObjectId } from "@/utils/isValidObjectId";
import { Request, Response } from "express";

export async function getPayees(req: Request, res: Response) {
  try {
    const payees = await db.payee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: payees,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getPayee(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (isValidObjectId(id) === false) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }
    const payee = await db.payee.findUnique({
      where: {
        id: id,
      },
    });

    if (!payee) {
      return res.status(404).json({ error: "Payee not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: payee,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createPayee(req: Request, res: Response) {
  try {
    const { name, phone } = req.body;

    const existPayee = await db.payee.findUnique({
      where: {
        phone,
      },
    });
    if (existPayee) {
      return res.status(409).json({
        error: `Payee (${phone}) phone is already existing !!!`,
        data: null,
      });
    }

    const newPayee = await db.payee.create({
      data: {
        name: name,
        phone,
      },
    });

    return res.status(201).json({
      error: null,
      data: newPayee,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updatePayee(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    const existPayee = await db.payee.findUnique({
      where: {
        id,
      },
    });
    if (!existPayee) {
      return res.status(404).json({
        error: `Payee is not found  !!!`,
        data: null,
      });
    }

    if (phone !== existPayee.phone) {
      const existPayeeByPhone = await db.payee.findUnique({
        where: {
          phone,
        },
      });
      if (existPayeeByPhone) {
        return res.status(409).json({
          error: `Payee "(${name})" name is Already existing !!!`,
          data: null,
        });
      }
    }

    const updatedPayee = await db.payee.update({
      where: {
        id,
      },
      data: {
        name: name,
        phone,
      },
    });

    return res.status(200).json({
      error: null,
      data: updatedPayee,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function deletePayee(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid ID", data: null });
    }
    const existPayee = await db.payee.findUnique({
      where: {
        id,
      },
    });
    if (!existPayee) {
      return res.status(404).json({
        error: `Payee is not found  !!!`,
        data: null,
      });
    }

    await db.payee.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      error: null,
      message: "Payee deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
