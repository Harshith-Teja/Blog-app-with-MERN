import express, { RequestHandler } from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getAllComments,
  // getAllLikes,
  getPostComments,
  likeComment,
} from "../controllers/commentController";

const router = express.Router();

router.post("/create-comment", createComment as RequestHandler);
router.get("/get-post-comments/:postId", getPostComments as RequestHandler);
router.put("/like-comment/:commentId", likeComment as RequestHandler);
router.put("/edit-comment/:commentId", editComment as RequestHandler);
router.delete("/delete-comment/:commentId", deleteComment as RequestHandler);
router.get("/get-all-comments", getAllComments as RequestHandler);
// router.get("/get-all-likes", getAllLikes as RequestHandler);

export default router;
