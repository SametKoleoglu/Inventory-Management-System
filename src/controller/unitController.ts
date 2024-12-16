import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getUnits(req: Request, res: Response) {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: units,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getUnit(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const unit = await db.unit.findUnique({
      where: {
        id: id,
      },
    });

    if (!unit) {
      return res.status(404).json({ error: "Unit not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: unit,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createUnit(req: Request, res: Response) {
  try {
    const { name, abbreviation, slug } = req.body;

    const existUnit = await db.unit.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existUnit) {
      return res
        .status(409)
        .json({ error: `Unit (${name}) is already existing !!!`, data: null });
    }

    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    return res.status(201).json({
      error: null,
      data: newUnit,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function updateUnit(req: Request, res: Response) {
  const { id } = req.params;
  const { name, abbreviation, slug } = req.body;
  try {
    const existingUnit = await db.unit.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUnit) {
      return res.status(404).json({ error: "Unit not found !!!", data: null });
    }

    if (slug !== existingUnit.slug) {
      const existingUnitBySlug = await db.unit.findUnique({
        where: {
          slug: slug,
        },
      });

      if (existingUnitBySlug) {
        return res.status(409).json({
          error: `Unit (${name}) is already existing !!!`,
          data: null,
        });
      }
    }

    const updatedUnit = await db.unit.update({
      where: {
        id: id,
      },
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    return res.status(200).json({
      error: null,
      data: updatedUnit,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, data: null });
  }
}

export async function deleteUnit(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const unit = await db.unit.findUnique({
      where: {
        id: id,
      },
    });

    if (!unit) {
      return res.status(404).json({ error: "Unit not found !!!", data: null });
    }

    await db.unit.delete({
      where: {
        id: id,
      },
    });

    res.status(204).json({
      error: null,
      message: "Deleted successfully !",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
