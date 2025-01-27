import express, { RequestHandler } from "express";
import { handleLogout } from "../controllers/logoutController";

const router = express.Router();

router.post("/", handleLogout as RequestHandler);

export default router;
