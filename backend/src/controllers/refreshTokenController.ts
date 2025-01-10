import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { IUser, User } from "../models/users";

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true }); //clearing existing token for refreshToken rotation

  try {
    const foundUser: IUser | null = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      //detected re-use of token

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: any, decoded: any) => {
          if (err) return res.sendStatus(401);

          //attempted the token re-use
          const hackedUser: IUser | null = await User.findOne({
            uname: decoded.username,
          }).exec();

          if (hackedUser != null) {
            //clear all the rf tokens
            hackedUser.refreshToken = [];

            const result = await hackedUser?.save();
            console.log(result);
          }
        }
      );

      return res.sendStatus(401);
    }

    const newRfTokenArr =
      foundUser.refreshToken?.filter((rf) => rf !== refreshToken) || [];

    //evaluate token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) {
          //rf token expired
          console.log("expired refresh token");

          foundUser.refreshToken = [...newRfTokenArr];
          const result = await foundUser.save();
          console.log(result);

          return res.status(403).json({ message: err.message });
        }

        const accessToken = jwt.sign(
          { username: foundUser.uname },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "30s" }
        );

        const newRefreshToken = jwt.sign(
          { username: foundUser.uname },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "1d" }
        );

        foundUser.refreshToken = [...newRfTokenArr, newRefreshToken];
        await foundUser.save();

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
      }
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
