import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; //uname extracted from JWT
    }
  }
}

//verifies the JWT tokens that are sent to the server
export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const token: string | undefined = req.cookies?.jwt;

  console.log("jwt ", token);
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(
    token,
    process.env.REFRESH_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: err.message });

      const payload = decoded as { id: string };
      req.userId = payload.id;

      next();
    }
  );
};
