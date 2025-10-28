import express, { RequestHandler } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getUserLikes,
  likePost,
  updatePost,
} from "../controllers/postController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.post(
  "/create-post",
  verifyJWT as RequestHandler,
  createPost as RequestHandler
);

router.get("/get-posts", getPosts);

router.delete(
  "/delete-post/:postId/:userId",
  verifyJWT as RequestHandler,
  deletePost as RequestHandler
);

router.put(
  "/update-post/:postId/:userId",
  verifyJWT as RequestHandler,
  updatePost as RequestHandler
);

router.put(
  "/like-post/:postId/:userId",
  verifyJWT as RequestHandler,
  likePost as RequestHandler
);

router.get(
  "/get-all-likes/:userId",
  verifyJWT as RequestHandler,
  getUserLikes as RequestHandler
);

export default router;
