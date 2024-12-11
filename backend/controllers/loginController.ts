import { Request, Response } from "express";
import { IUser, User } from "../models/users";
import bcrypt from "bcrypt";

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
      res.status(201).json({ message: "User successfully logged in" });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
