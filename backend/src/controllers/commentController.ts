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
