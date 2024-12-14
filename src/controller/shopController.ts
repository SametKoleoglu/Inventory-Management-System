import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getShops(req: Request, res: Response) {
  try {
    const shops = await db.shop.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      error: null,
      data: shops,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getShop(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const shop = await db.shop.findUnique({
      where: {
        id: id,
      },
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found !!!", data: null });
    }

    res.status(200).json({
      error: null,
      data: shop,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
export async function getShopAttendants(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existShop = await db.shop.findUnique({
      where: {
        id: id,
      },
    });

    if (!existShop) {
      return res.status(404).json({ error: "Shop not found !!!", data: null });
    }

    const attendants = await db.user.findMany({
      where: {
        id: {
          in: existShop.attendantIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        image: true,
        gender: true,
      },
    });

    return res.status(200).json({
      error: null,
      data: attendants,
    });

    // const filteredAttendants = attendants.map((attendant) => {
    //   const { password, ...others } = attendant;
    //   return others;
    // });

    // return res.status(200).json({
    //   error: null,
    //   data: filteredAttendants,
    // });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function createShop(req: Request, res: Response) {
  const {} = req.body;

  try {
    const { name, slug, location, adminId, attendantIds } = req.body;

    const existShop = await db.shop.findUnique({
      where: {
        slug: slug,
      },
    });
    if (existShop) {
      return res
        .status(409)
        .json({ error: `Shop (${name}) is already existing !!!`, data: null });
    }

    const newShop = await db.shop.create({
      data: {
        name: name,
        slug: slug,
        location: location,
        adminId: adminId,
        attendantIds: attendantIds,
      },
    });

    return res.status(201).json({
      error: null,
      data: newShop,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
