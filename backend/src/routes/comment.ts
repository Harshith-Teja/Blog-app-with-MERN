import express, { RequestHandler } from "express";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../controllers/commentController";

const router = express.Router();

router.post("/create-comment", createComment as RequestHandler);
router.get("/get-post-comments/:postId", getPostComments as RequestHandler);
router.put("/like-comment/:commentId", likeComment as RequestHandler);

export default router;
