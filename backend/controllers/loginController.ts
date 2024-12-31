import { Request, Response } from "express";
import { IUser, User } from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const handleLoginUser = async (req: Request, res: Response) => {
  const { uname, pwd } = req.body;

  if (!uname || !pwd)
    return res
      .status(400)
      .json({ message: "Username & password are required to login" });

  try {
    const foundUser: IUser | null = await User.findOne({ uname });

    if (!foundUser)
      return res.status(401).json({ message: "User doesn't exist" });

    const match = await bcrypt.compare(pwd, foundUser.pwd);

    if (match) {
      //create JWTs

      const accessToken = jwt.sign(
        { username: foundUser.uname },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "30s" }
      );

      const refreshToken = jwt.sign(
        { username: foundUser.uname },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1d" }
      );

      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ accessToken });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
