import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/users";

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) return res.sendStatus(401);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: any, decoded: any) => {
        if (err) return res.status(403).json({ message: err.message });

        const accessToken = jwt.sign(
          { username: foundUser.uname },
          process.env.ACCESS_TOKEN_SECRET as string,
          { expiresIn: "30s" }
        );

        res.json({ accessToken });
      }
    );
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
