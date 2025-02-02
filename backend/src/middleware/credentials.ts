import { NextFunction, Request, Response } from "express";
import allowedOrigins from "../config/allowedOrigins";

//allows the client to send cookies to the server(backend)
const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  console.log("origin ", origin);
  if (allowedOrigins.includes(origin || "")) {
    res.header("Access-Control-Allow-Credentials", "true");
  }

  next();
};

export default credentials;
