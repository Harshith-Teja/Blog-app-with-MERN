import { Link } from "react-router-dom";
import { PostType } from "../types/PostType";

type PostCardProps = {
  post: PostType;
};

// Helper function to map categories to specific Tailwind gradients
const getCategoryGradient = (category: string) => {
  switch (category.toLowerCase()) {
    case "programming":
      return "from-indigo-500 to-purple-600";
    case "finance":
      return "from-emerald-400 to-teal-600";
    case "travel":
      return "from-sky-400 to-blue-600";
    default:
      return "from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-800";
  }
};

const PostCard = ({ post }: PostCardProps) => {
  const gradientClasses = getCategoryGradient(post.category);

  return (
    <div className="relative flex flex-col bg-white dark:bg-white/[0.08] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-cyan-400/50 dark:hover:border-cyan-400/60 dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-300 overflow-hidden group">
      {/* Dynamic Gradient Thumbnail */}
      <div
        className={`w-full h-32 bg-gradient-to-br ${gradientClasses} group-hover:scale-105 transition-transform duration-500`}
      ></div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mt-1">
          {post.category !== "uncategorized" ? post.category : "General"}
        </span>

        <p className="text-xl font-bold text-slate-900 dark:text-white line-clamp-2">
          {post.title}
        </p>

        <div className="mt-auto pt-4">
          <Link
            to={`/posts/${post.slug}`}
            className="inline-block w-full text-center border border-cyan-500 text-cyan-600 dark:text-cyan-400 dark:border-cyan-500/50 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white dark:hover:text-white hover:border-transparent font-medium p-2 rounded-lg transition-all duration-300"
          >
            Read article
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
