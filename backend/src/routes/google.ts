import express, { RequestHandler } from "express";
import { googleLoginController } from "../controllers/googleLoginController";

const router = express.Router();

router.post("/", googleLoginController as RequestHandler);

export default router;
