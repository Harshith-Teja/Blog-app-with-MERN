import { Request, Response } from "express";
import { IUser, User } from "../models/users";

export const handleLogout = async (req: Request, res: Response) => {
  //delete accessToken on client's side as well

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  //is refreshToken in the db
  try {
    const foundUser: IUser | null = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true });
      return res.sendStatus(204);
    }

    //clear the refreshToken in the db
    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
