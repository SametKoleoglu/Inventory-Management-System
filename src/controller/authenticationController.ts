import { generateEmailHTML } from "./../utils/generateEmailTemplate";
import { db } from "@/db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken, generateToken } from "@/utils/generateToken";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken().toString();
    const resetTokenExpiry = addMinutes(new Date(), 15);
    const currentTime = new Date();

    const updatedUser = await db.user.update({
      where: {
        email,
      },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    //!!! Resend Email Servisinden Onaylı bir domain almak gerekiyor!!!
    const { data, error } = await resend.emails.send({
      from: "IPOS <info@rwoma.com>",
      to: email,
      subject: "Password Reset Request",
      html: generateEmailHTML(resetToken),
    });

    if (error) {
      return res.status(400).json({ error });
    }

    const result = {
      userId: updatedUser.id,
      emailId: data?.id,
    };
    return res.status(200).json({
      message: `Password reset email sent to ${email}`,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, data: null });
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const { resetToken } = req.body;

    const existingUser = await db.user.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: { gte: new Date() },
      },
    });
    if (!existingUser) {
      return res
        .status(400)
        .json({ data: null, message: "Invalid or expired token" });
    }

    return res.status(200).json({ message: "Token is valid" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message, data: null });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const currentUser = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!currentUser) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message, data: null });
  }
}
