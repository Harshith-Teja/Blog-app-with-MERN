import { Request, Response } from "express";
import { IUser, User } from "../models/users";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(201).json({ users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  // const { id } = req.params;
  if (!req?.body?.id)
    return res
      .status(400)
      .json({ message: "User Id is required to delete the user" });

  try {
    const user = await User.find({ _id: req.body.id }).exec();

    if (!user) return res.status(204).json({ message: "User Id not found" });

    await User.deleteOne({ _id: req.body.id });

    res.status(201).json({ message: "User has been deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  //const { id } = req.params;
  if (!req?.body?.id)
    return res
      .status(400)
      .json({ message: "User Id is required to fetch the user" });

  try {
    const user = await User.find({ _id: req.body.id }).exec();

    if (!user) return res.status(204).json({ message: "User Id not found" });

    res.status(201).json({ user });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
