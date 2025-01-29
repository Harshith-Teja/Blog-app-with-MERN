import { Document, model, Schema } from "mongoose";

interface IComment extends Document {
  content: string;
  postId: string;
  userId: string;
  likes?: Array<String>;
  numOfLikes?: Number;
}

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    postId: { type: String, required: true },
    userId: { type: String, required: true },
    likes: { type: Array, default: [] },
    numOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Comment = model<IComment>("Comment", commentSchema);
