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
  const authHeader: string =
    req.headers.authorization || (req.headers.Authorization as string);

  console.log("jwt ", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        console.log(err.message);
        return res.status(403).json({ message: err.message });
      }

      const payload = decoded as { id: string };
      req.userId = payload.id;

      next();
    }
  );
};
