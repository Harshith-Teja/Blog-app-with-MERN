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
