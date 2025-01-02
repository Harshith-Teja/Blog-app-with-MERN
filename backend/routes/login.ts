import express, { RequestHandler } from "express";
import { handleLoginUser } from "../controllers/loginController";

const router = express.Router();

router.post("/", handleLoginUser as unknown as RequestHandler);

export default router;
