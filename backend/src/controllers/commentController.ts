import { Request, Response } from "express";
import { Comment } from "../models/comment";
import { Post } from "../models/posts";

//create a comment
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

//gets the post comments based on the postId
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

//adds like to a comment based on the commentId
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

//edits a comment content based on comment id
export const editComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "comment not found" });

    if (req.userId !== comment.userId)
      return res
        .status(401)
        .json({ message: "You are not allowed to edit this comment" });

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );

    res.status(200).json({ editedComment });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//deletes a comment based on commentId
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "comment not found" });

    if (req.userId !== comment.userId)
      return res
        .status(401)
        .json({ message: "You are not allowed to edit this comment" });

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({ message: "Comment has been deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//fetches all comments on all posts of a specified user
export const getAllComments = async (req: Request, res: Response) => {
  try {
    const startInd = parseInt(req.query.startInd as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    console.log(req.query.userId);
    const postsOfUser = await Post.find({ userId: req.query.userId });

    //resolve all asynchronous operations in parallel
    const comments = await Promise.all(
      postsOfUser.map(async (post) => {
        const postComments = await Comment.find({ postId: post._id })
          .sort({ creadtedAt: sortDirection })
          .skip(startInd)
          .limit(limit);
        return postComments;
      })
    );

    const allComments = comments.flat(); //flattens the nested array

    const totalCommentsCount = await Promise.all(
      postsOfUser.map(async (post) => {
        const count = await Comment.countDocuments({ postId: post._id });
        return count;
      })
    );

    const totalComments = totalCommentsCount.reduce(
      (sum, count) => sum + count,
      0
    );

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalLastMonthCommentsCount = await Promise.all(
      postsOfUser.map(async (post) => {
        const count = await Comment.countDocuments({
          postId: post._id,
          createdAt: { $gte: oneMonthAgo },
        });
        return count;
      })
    );

    const totalLastMonthComments = totalLastMonthCommentsCount.reduce(
      (sum, count) => sum + count,
      0
    );

    res
      .status(200)
      .json({ allComments, totalComments, totalLastMonthComments });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//fetches all likes on all comments on all posts of a specified user
/* export const getAllLikes = async (req: Request, res: Response) => {
  try {
    const postsOfUser = await Post.find({ userId: req.query.userId });

    const comments = await Promise.all(
      postsOfUser.map(async (post) => {
        const postComments = Comment.find({ postId: post._id });
        return postComments;
      })
    );

    const allComments = comments.flat();

    const totalLikeCount = allComments.map((comment) => comment.numOfLikes);

    const totalLikes = totalLikeCount.reduce((sum, count) => sum + count, 0);

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Promise.all(
      postsOfUser.map(async (post) => {
        const lastMonthPostComments = await Comment.find({
          postId: post._id,
          createdAt: { $gte: oneMonthAgo },
        });
        return lastMonthPostComments;
      })
    );

    const allLastMonthComments = lastMonthComments.flat();

    const totalLastMonthLikesCount = allLastMonthComments.map(
      (comment) => comment.numOfLikes
    );

    const totalLastMonthLikes = totalLastMonthLikesCount.reduce(
      (sum, count) => sum + count,
      0
    );

    res.status(200).json({ totalLikes, totalLastMonthLikes });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}; */
