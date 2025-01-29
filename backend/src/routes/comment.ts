import express, { RequestHandler } from "express";
import { createComment } from "../controllers/commentController";

const router = express.Router();

router.post("/create-comment", createComment as RequestHandler);

export default router;
