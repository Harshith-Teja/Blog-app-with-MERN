import { Request, Response } from "express";
import { IUser, User } from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const handleLoginUser = async (req: Request, res: Response) => {
  const { uname, pwd } = req.body;
  const cookies = req.cookies;

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

      const newRefreshToken = jwt.sign(
        { username: foundUser.uname },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1d" }
      );

      //if a jwt rf token cookie exists, clear both the cookie and that token
      let newRfTokenArr = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken?.filter((rf) => rf !== cookies.jwt) || [];

      if (cookies.jwt) {
        //detected re-use of rf token

        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        if (!foundToken) {
          //a rf is used and if it is not there in the db, then it is a stolen rf token
          console.log("attempted refresh token re-use at login");
          newRfTokenArr = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
      }

      foundUser.refreshToken = [...(newRfTokenArr || []), newRefreshToken];
      const result = await foundUser.save();
      console.log(result);

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
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
