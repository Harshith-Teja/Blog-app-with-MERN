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

export const likeComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "comment not found" });

    const userInd = comment.likes?.indexOf(req.userId as string);

    if (userInd === -1) {
      //user not found(not liked)
      comment.likes?.push(req.userId as string); //add like
      comment.numOfLikes += 1;
    } else {
      //user found(liked)
      comment.likes?.splice(userInd as number, 1); //remove like
      comment.numOfLikes -= 1;
    }

    await comment.save();

    res.status(200).json({ comment });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
