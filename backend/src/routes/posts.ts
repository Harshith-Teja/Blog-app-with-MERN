import express, { RequestHandler } from "express";
import { createPost, getPosts } from "../controllers/postController";

const router = express.Router();

router.post("/create-post", createPost as RequestHandler);
router.get("/get-posts", getPosts);

export default router;
