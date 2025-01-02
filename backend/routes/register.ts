import express, { RequestHandler, Router } from "express";
import { handleNewUser } from "../controllers/registerController";

const router: Router = express.Router();

router.post("/", handleNewUser as unknown as RequestHandler);

export default router;
