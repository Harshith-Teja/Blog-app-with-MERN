export type CommentType = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes?: Array<String>;
  numOfLikes: number;
  createdAt?: string;
  updatedAt?: string;
};
