import { CustomerType } from "./../../node_modules/.prisma/client/index.d";
import { db } from "@/db/db";
import { Request, Response } from "express";

export async function getCustomers(req: Request, res: Response) {
  //   const users = [
  //     { id: 1, name: "John Doe" },
  //     { id: 2, name: "Jane Doe" },
  //     { id: 3, name: "Bob Smith" },
  //   ];
  //   res.status(200).json(users);

  try {
    const customers = await db.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(customers);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function getCustomerById(req: Request, res: Response) {
  const { id }: any = await req.params;

  // Classic Method
  /*  const users = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Doe" },
      { id: 3, name: "Bob Smith" },
    ];

    for (const user of users) {
      if (user.id === parseInt(id)) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    }*/

  try {
    if (id.length > 12) {
      const customer = await db.customer.findUnique({
        where: {
          id: id,
        },
      });

      if (customer) {
        return res.status(200).json(customer);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      return res.status(404).json({ message: "Id is not valid!!!!" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
}

export async function createCustomer(req: Request, res: Response) {
  const {
    customerType,
    firstName,
    lastName,
    phone,
    gender,
    country,
    location,
    maxCreditLimit,
    maxCreditDays,
    taxPin,
    dob,
    email,
    NIN,
  } = req.body;
  try {
    //     const user = await prisma.user.create({
    //       data: {
    //         name: name,
    //         email: email,
    //         phone: phone,
    //       },
    //     });

    const existingCustomerByPhone = await db.customer.findUnique({
      where: {
        phone: phone,
      },
    });

    if (existingCustomerByPhone) {
      return res.status(409).json({
        error:
          "Customer already exists ! This phone number is making use of by another customer",
        data: null,
      });
    }

    if (email) {
      const existingCustomerByEmail = await db.customer.findUnique({
        where: {
          email: email,
        },
      });
      if (existingCustomerByEmail) {
        return res.status(409).json({
          error:
            "Customer already exists ! This email is making use of by another customer",
          data: null,
        });
      }
    }
    if (NIN) {
      const existingCustomerByNIN = await db.customer.findUnique({
        where: {
          NIN: NIN,
        },
      });
      if (existingCustomerByNIN) {
        return res.status(409).json({
          error:
            "Customer already exists ! This National Identification is making use of by another customer",
          data: null,
        });
      }
    }

    const newCustomer = await db.customer.create({
      data: {
        customerType,
        firstName,
        lastName,
        phone,
        gender,
        country,
        location,
        maxCreditLimit,
        maxCreditDays,
        taxPin,
        dob,
        email,
        NIN,
      },
    });
    return res.status(201).json(newCustomer);
  } catch (error: any) {
    console.log(error.message);
  }
}
