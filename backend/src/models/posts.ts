import { Document, model, Schema } from "mongoose";

interface IPost extends Document {
  userId: String;
  title: String;
  content: String;
  category?: String;
  slug: String;
}

const postsSchema = new Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    category: { type: String, default: "uncategorized" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Post = model<IPost>("Post", postsSchema);
