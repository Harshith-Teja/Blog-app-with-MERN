import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IUser, User } from "../models/users";

export const handleNewUser = async (req: Request, res: Response) => {
  const { uname, pwd } = req.body;

  if (!uname || !pwd)
    return res
      .status(400)
      .json({ message: "Email and password are mandatory" });

  //check for duplicate
  const duplicate = await User.find((person: IUser) => person.uname === uname);

  if (duplicate)
    return res.status(409).json({ message: "Email already exists" });

  try {
    //hash the pwd
    const hashedPwd = bcrypt.hash(pwd, 10);

    //store the new user in the db
    const newUser = new User({ uname, hashedPwd });
    await newUser.save();

    res.status(201).json({ success: "user has been successfully created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
