import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  uname: string;
  pwd: string;
}

const userSchema = new Schema({
  uname: { type: String, required: true },
  pwd: { type: String, required: true },
});

export const User = model<IUser>("User", userSchema);
