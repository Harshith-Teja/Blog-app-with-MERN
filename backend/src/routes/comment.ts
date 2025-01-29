import express, { RequestHandler } from "express";
import {
  createComment,
  getPostComments,
} from "../controllers/commentController";

const router = express.Router();

router.post("/create-comment", createComment as RequestHandler);
router.get("/get-post-comments/:postId", getPostComments as RequestHandler);

export default router;
