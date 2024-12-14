import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const filteredUsers = users.map((user) => {
      const { password, ...others } = user;
      return others;
    });
    res.status(200).json(filteredUsers);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function createUser(req: Request, res: Response) {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  try {
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUserByEmail) {
      return res
        .status(409)
        .json({ error: "Email already exists", data: null });
    }
    const existingUserByPhone = await db.user.findUnique({
      where: {
        phone: phone,
      },
    });
    if (existingUserByPhone) {
      return res
        .status(409)
        .json({ error: "Phone number already exists", data: null });
    }
    const existingUserByUsername = await db.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUserByUsername) {
      return res
        .status(409)
        .json({ error: "Username already exists", data: null });
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        dob: dob,
        role: role,
        gender: gender,
        image: image
          ? image
          : "https://img.freepik.com/free-vector/isolated-young-handsome-man-different-poses-white-background-illustration_632498-859.jpg?t=st=1734171450~exp=1734175050~hmac=8be63e1803e4bbb9393d8598c0e08fa31f3b67228619d58d5ce3a98a342bc18d&w=826",
      },
    });

    const { password: savedPassword, ...others } = newUser;

    return res.status(201).json({
      data: others,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}

export async function getUser(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //!! Burada ilk parametreyi alıp, ikinci parametereye diğer verileri aktarıyoruz !!
    const { password, ...result } = user;
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const {
    email,
    username,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    password,
  } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== existingUser.email) {
      const existingUserByEmail = await db.user.findUnique({
        where: {
          email: email,
        },
      });
      if (existingUserByEmail) {
        return res
          .status(409)
          .json({ error: "Email already exists", data: null });
      }
    }
    if (phone && phone !== existingUser.phone) {
      const existingUserByPhone = await db.user.findUnique({
        where: {
          phone: phone,
        },
      });
      if (existingUserByPhone) {
        return res
          .status(409)
          .json({ error: "Phone number already exists", data: null });
      }
    }

    if (username && username !== existingUser.username) {
      const existingUserByUsername = await db.user.findUnique({
        where: {
          username: username,
        },
      });
      if (existingUserByUsername) {
        return res
          .status(409)
          .json({ error: "Username already exists", data: null });
      }
    }

    let hashedPassword = existingUser.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.user.update({
      where: {
        id: id,
      },
      data: {
        email: email ? email : existingUser.email,
        username: username ? username : existingUser.username,
        password: hashedPassword,
        firstName: firstName ? firstName : existingUser.firstName,
        lastName: lastName ? lastName : existingUser.lastName,
        phone: phone ? phone : existingUser.phone,
        dob: dob ? dob : existingUser.dob,
        gender: gender ? gender : existingUser.gender,
        image: image ? image : existingUser.image,
      },
    });

    const { password: userPass, ...others } = updatedUser;
    return res.status(200).json({
      data: others,
      error: null,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, data: null });
  }
}

export async function updateUserPassword(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword: string = await bcrypt.hash(password, 10);
    const updatedUser = await db.user.update({
      where: {
        id: id,
      },
      data: {
        password: hashedPassword,
      },
    });
    const { password: savedPassword, ...others } = updatedUser;
    return res.status(200).json({
      message: "Password updated successfully !",
      data: others,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await db.user.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      message: "User deleted successfully !",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}

export async function getAttendants(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ATTENDANT",
      },
    });
    const filteredUsers = users.map((user) => {
      const { password, ...others } = user;
      return others;
    });
    res.status(200).json(filteredUsers);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
