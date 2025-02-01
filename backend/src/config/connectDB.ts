import mongoose from "mongoose";

//connects to mongodb database
export const connectDB = async () => {
  try {
    await mongoose.connect((process.env.MONGODB_URI as string) || "");
    console.log("connected to mongodb successfully");
  } catch (err) {
    console.log("error connecting to mongodb");
  }
};
