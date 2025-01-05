import express, { RequestHandler } from "express";
import { handleRefreshToken } from "../controllers/refreshTokenController";

const router = express.Router();

router.get("/", handleRefreshToken as RequestHandler);

export default router;
