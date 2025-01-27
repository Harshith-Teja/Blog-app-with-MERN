import { Request, Response } from "express";
import { IUser, User } from "../models/users";

export const handleLogout = async (req: Request, res: Response) => {
  //delete accessToken on client's side as well

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;

  //check if refreshToken in the db
  try {
    const foundUser: IUser | null = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.sendStatus(204);
    }

    //clear the refreshToken in the db
    foundUser.refreshToken =
      foundUser.refreshToken?.filter((rf) => rf !== refreshToken) || []; //clears the token of current device and keeps the tokens of other devices intact
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
