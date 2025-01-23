import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  uname: string;
  pwd: string;
  refreshToken?: string[];
}

const userSchema = new Schema(
  {
    uname: { type: String, required: true },
    pwd: { type: String, required: true },
    email: { type: String },
    profilePic: {
      type: String,
      default:
        "https://tse4.mm.bing.net/th?id=OIP.4Q7-yMnrlnqwR4ORH7c06AHaHa&pid=Api&P=0&h=180",
    },
    refreshToken: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
