import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/users";

export const handleNewUser = async (req: Request, res: Response) => {
  const { uname, pwd } = req.body;

  if (!uname || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are mandatory" });

  //check for duplicate
  const duplicate = await User.findOne({ uname }).exec();

  if (duplicate)
    return res.status(409).json({ message: "Username already exists" });

  try {
    //hash the pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //store the new user in the db
    const newUser = new User({ uname, pwd: hashedPwd });
    await newUser.save();

    res.status(201).json({ success: "user has been successfully created" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
