import { Link } from "react-router-dom";
import { PostType } from "../types/PostType";

type PostCardProps = {
  post: PostType;
};

const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="p-3 flex-1 flex flex-col gap-2 border hover:border-2 border-slate-500 rounded-lg hover:scale-105 transition-transform duration-300">
      <p className="text-lg font-semibold">{post.title}</p>
      <span className="italic text-sm">
        {post.category !== "uncategorized" && post.category}
      </span>
      <Link
        to={`/posts/${post.slug}`}
        className="border border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white p-2 m-2 rounded-md mt-auto"
      >
        Read article
      </Link>
    </div>
  );
};

export default PostCard;
