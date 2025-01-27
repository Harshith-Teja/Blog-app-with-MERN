import express, { RequestHandler } from "express";
import { createPost } from "../controllers/postController";

const router = express.Router();

router.post("/", createPost as RequestHandler);

export default router;
