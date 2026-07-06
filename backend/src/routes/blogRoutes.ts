import express, { RequestHandler } from "express";
import { generateTLDR } from "../controllers/generateTLDRController";
const router = express.Router();

router.post("/summary/:id", generateTLDR as unknown as RequestHandler);

export default router;
