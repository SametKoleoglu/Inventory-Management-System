import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getSuppliers(req: Request, res: Response) {
  try {
    const suppliers = await db.supplier.findMany();
    return res.status(200).json({
      error: null,
      data: suppliers,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
export async function getSupplier(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const supplier = await db.supplier.findUnique({
      where: {
        id: id,
      },
    });
    if (!supplier) {
      return res
        .status(404)
        .json({ error: "Supplier not found !!!", data: null });
    }
    return res.status(200).json({
      error: null,
      data: supplier,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
export async function createSupplier(req: Request, res: Response) {
  const { phone, email, regNumber } = req.body;
  try {
    if (phone) {
      const existingSupplierByPhone = await db.supplier.findUnique({
        where: {
          phone: phone,
        },
      });

      if (existingSupplierByPhone) {
        return res.status(409).json({
          error: "Supplier already exists ! Phone is in use",
          data: null,
        });
      }
    }

    if (email) {
      const existingSupplierByEmail = await db.supplier.findUnique({
        where: {
          email: email,
        },
      });

      if (existingSupplierByEmail) {
        return res.status(409).json({
          error: "Supplier already exists ! Email is in use",
          data: null,
        });
      }
    }

    if (regNumber) {
      const existingSupplierByRegNumber = await db.supplier.findUnique({
        where: {
          regNumber: regNumber,
        },
      });

      if (existingSupplierByRegNumber) {
        return res.status(409).json({
          error: "Supplier already exists ! Registration Number is in use",
          data: null,
        });
      }
    }

    const newSupplier = await db.supplier.create({
      data: req.body,
    });
    return res.status(201).json({
      error: null,
      data: newSupplier,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
