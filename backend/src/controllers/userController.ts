import { Request, Response } from "express";
import { IUser, User } from "../models/users";
import bcrypt from "bcrypt";

export const updateUser = async (req: Request, res: Response) => {
  if (req.userId !== req.params.id)
    return res.status(401).json({ message: "Unauthorized" });

  if (!req.body.uname && !req.body.pwd)
    return res.status(400).json({ message: "Nothing to update" });

  const updateFields: Partial<IUser> = {};

  if (req.body.uname) updateFields.uname = req.body.uname;

  if (req.body.pwd) updateFields.pwd = await bcrypt.hash(req.body.pwd, 10);

  try {
    const updatedUser: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updateFields,
      },
      { new: true, runValidators: false }
    );

    //check if user exists
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    const { pwd, ...userWithoutPwd } = updatedUser?.toObject();

    res.status(200).json({ userWithoutPwd });
  } catch (err: any) {
    res.status(500).json({ message: "An unexpected error occured" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(201).json({ users });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (req.userId !== id)
    return res
      .status(400)
      .json({ message: "You are not allowed to delete the user" });

  try {
    const user = await User.find({ _id: id }).exec();

    if (!user) return res.status(404).json({ message: "User Id not found" });

    await User.deleteOne({ _id: id });

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
