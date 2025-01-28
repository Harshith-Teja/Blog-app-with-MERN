import express, { RequestHandler } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/postController";

const router = express.Router();

router.post("/create-post", createPost as RequestHandler);
router.get("/get-posts", getPosts);
router.delete("/delete-post/:postId/:userId", deletePost as RequestHandler);
router.put("/update-post/:postId/:userId", updatePost as RequestHandler);

export default router;
