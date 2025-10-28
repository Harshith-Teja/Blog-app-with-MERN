import { Document, model, Schema } from "mongoose";

interface IPost extends Document {
  userId: String;
  title: String;
  content: String;
  category?: String;
  slug: String;
  likes?: Array<String>;
  numOfLikes: number;
  createdAt: Date;
}

const postsSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: { type: String, default: "uncategorized" },
    slug: { type: String, required: true, unique: true },
    likes: { type: Array, default: [] },
    numOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", postsSchema);
