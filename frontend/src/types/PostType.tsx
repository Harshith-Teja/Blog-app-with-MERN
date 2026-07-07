export type PostType = {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  likes?: Array<String>;
  numOfLikes: number;
};
