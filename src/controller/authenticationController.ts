import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "@/utils/generateToken";

export async function signIn(req: Request, res: Response) {
  const { username, email, password } = await req.body;
  try {
    let user = null;
    if (username) {
      const existUserByUsername = await db.user.findUnique({
        where: {
          username: username,
        },
      });
      if (!existUserByUsername) {
        return res
          .status(404)
          .json({ message: `(${username}) This username does not exist` });
      }
      if (existUserByUsername) {
        user = existUserByUsername;
      }
    }
    if (email) {
      const existUserByEmail = await db.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!existUserByEmail) {
        return res
          .status(404)
          .json({ message: `(${email}) This email does not exist` });
      }
      if (existUserByEmail) user = existUserByEmail;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(403).json({ message: "Wrong password", data: null });

    const { password: userPass, ...userWithoutPassword } = user;
    const accessToken = await generateAccessToken(userWithoutPassword);
    const result = {
      ...userWithoutPassword,
      accessToken,
    };

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
}
