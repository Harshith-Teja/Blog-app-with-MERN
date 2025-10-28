import { Request, Response } from "express";
import { Post } from "../models/posts";

//creates a post
export const createPost = async (req: Request, res: Response) => {
  if (!req.body.title || !req.body.content)
    return res
      .status(400)
      .json({ message: "Both title and content of the post are required" });

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace("/[^a-zA-Z0-9-]", "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.userId,
  });

  try {
    const savedPost = await newPost.save();

    res.status(201).json({ savedPost });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//fetches all the posts or filters them based on the queries from the cliet side
export const getPosts = async (req: Request, res: Response) => {
  try {
    const startInd = parseInt(req.query.startInd as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category &&
        req.query.category !== "uncategorized" && {
          category: req.query.category,
        }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startInd)
      .limit(limit);

    const totalPosts = await Post.countDocuments({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    });

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//deletes a post
export const deletePost = async (req: Request, res: Response) => {
  if (req.userId !== req.params.userId)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post has been successfully deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//updates a post
export const updatePost = async (req: Request, res: Response) => {
  if (req.userId !== req.params.userId)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          content: req.body.content,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//likes a post
export const likePost = async (req: Request, res: Response) => {
  if (req.userId !== req.params.userId)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const updatedPost = await Post.findById(req.params.postId);

    if (!updatePost) return res.status(404).json({ message: "Post not found" });

    if (updatedPost) {
      const userInd = updatedPost.likes?.indexOf(req.params.userId);

      if (userInd === -1) {
        //user not found(not liked)
        updatedPost.likes?.push(req.params.userId as string);
        updatedPost.numOfLikes = ((updatedPost.numOfLikes as number) || 0) + 1;
      } else {
        //user found(liked)
        updatedPost.likes?.splice(userInd as number, 1);
        updatedPost.numOfLikes = ((updatedPost.numOfLikes as number) || 1) - 1;
      }

      await updatedPost.save(); // Don't forget to save the updated post

      res.status(200).json(updatedPost);
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

//fetches all likes of all posts of a user
export const getUserLikes = async (req: Request, res: Response) => {
  if (req.userId !== req.params.userId)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const userPosts = await Post.find({ userId: req.params.userId });

    const totalLikeCountByPost = userPosts.map((post) => post.numOfLikes);

    const totalLikes = totalLikeCountByPost.reduce(
      (sum, count) => sum + count,
      0
    );

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = userPosts.filter(
      (post) => post.createdAt >= oneMonthAgo
    );

    const totalLastMonthLikeCountByPost = lastMonthPosts.map(
      (post) => post.numOfLikes
    );

    const totalLastMonthLikes = totalLastMonthLikeCountByPost.reduce(
      (sum, count) => sum + count,
      0
    );

    res.status(200).json({ totalLikes, totalLastMonthLikes });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
