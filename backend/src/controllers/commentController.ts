import { Request, Response } from "express";
import { Comment } from "../models/comment";

export const createComment = async (req: Request, res: Response) => {
  const { content, postId, userId } = req.body;

  if (req.userId !== userId) res.status(401).json({ message: "Unauthorized" });

  try {
    const newComment = new Comment({ content, postId, userId });

    await newComment.save();

    res.status(201).json({ newComment });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postComments = await Comment.find({ postId: req.params.postId }).sort(
      { createdAt: -1 }
    );

    res.status(200).json({ postComments });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
