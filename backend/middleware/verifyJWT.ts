import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: string; //uname extracted from JWT
    }
  }
}

interface DecodedToken extends JwtPayload {
  username: string;
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: string | undefined = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ message: "Auth header doesn't exist" });

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: err.message });

      const payload = decoded as DecodedToken;

      req.user = payload?.username;

      next();
    }
  );
};
