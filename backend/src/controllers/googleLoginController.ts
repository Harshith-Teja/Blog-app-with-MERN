import { Request, Response } from "express";
import { IUser, User } from "../models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const googleLoginController = async (req: Request, res: Response) => {
  const { name, email, photoUrl } = req.body;
  const cookies = req.cookies;

  if (!name || !email || !photoUrl)
    return res
      .status(400)
      .json({ message: "All of name, email, photoUrl are required" });

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      //User exists -> SignIn -> refreshToken rotation
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

      const { pwd, ...userWithoutPwd } = foundUser.toObject();

      res.status(201).json({ accessToken, userWithoutPwd });
    } else {
      // User doesn't exist -> SignUp -> create uname & pwd for the user

      const generatedPwd =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPwd = await bcrypt.hash(generatedPwd, 10);

      const generatedUname =
        name.toLowerCase().split(" ").join("") +
        Math.random().toString(9).slice(-4);

      //create new User
      const newUser: IUser = new User({
        uname: generatedUname,
        pwd: hashedPwd,
        email,
        profilePic: photoUrl,
      });

      const accessToken = jwt.sign(
        { username: newUser.uname },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "30s" }
      );

      const refreshToken = jwt.sign(
        { username: newUser.uname },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "1d" }
      );

      newUser.refreshToken = [refreshToken];
      await newUser.save();

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      const { pwd, ...userWithoutPwd } = newUser.toObject();

      res.status(201).json({ accessToken, userWithoutPwd });
    }
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
};
