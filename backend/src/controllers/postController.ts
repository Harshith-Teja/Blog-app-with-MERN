import { Request, Response } from "express";
import { Post } from "../models/posts";

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

export const getPosts = async (req: Request, res: Response) => {
  try {
    const startInd = parseInt(req.query.startInd as string) || 0;
    const limit = parseInt(req.query.limit as string) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchItem && {
        $or: [
          { title: { $regex: req.query.searchItem, $options: "i" } },
          { content: { $regex: req.query.content, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startInd)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

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
