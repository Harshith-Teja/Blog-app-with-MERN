import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spinner } from "flowbite-react";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  // Extract postsLoading from your custom hook
  const { postsData, postsLoading } = useFetchPosts(
    `${BASE_URL}/posts/get-posts`,
    []
  );

  useEffect(() => {
    if (postsData?.posts) {
      setPosts(postsData.posts);
    }
  }, [postsData]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent font-sans pb-12">
      {/* 1. Aurora Hero Section */}
      <section className="relative flex flex-col gap-6 px-4 py-24 md:py-32 max-w-6xl mx-auto items-center text-center bg-white dark:bg-white/[0.02] rounded-3xl shadow-sm border border-cyan-100 dark:border-white/5 my-8 overflow-hidden z-0 backdrop-blur-xl">
        {/* Vibrant Aurora Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/40 dark:bg-cyan-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] z-[-1] animate-pulse"></div>
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-400/40 dark:bg-fuchsia-500/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] z-[-1] animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <span className="bg-cyan-50 text-cyan-600 text-xs font-bold px-3 py-1 rounded-full dark:bg-cyan-500/10 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 backdrop-blur-md">
          ✨ New & Trending
        </span>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-fuchsia-500">
            Blog Smith
          </span>
        </h1>

        <p className="max-w-2xl text-slate-500 text-md sm:text-lg dark:text-slate-400 mt-2">
          Discover insights on programming, finance, travel, and more. Forge
          your thoughts into powerful posts and share them with the world.
        </p>

        <Link
          to="/search"
          className="mt-6 inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full hover:from-cyan-400 hover:to-blue-500 focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800/80 transition-all shadow-lg hover:shadow-cyan-500/50 dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
        >
          Search a post
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>
      </section>

      {/* 2. Content Section (Loading or Loaded) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {postsLoading ? (
          /* Shimmer UI & Waking Server Message */
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center justify-center mb-12 text-center animate-pulse">
              <Spinner size="xl" className="mb-4 text-cyan-500 fill-blue-600" />
              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                Waking up the server...
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                Because this app uses a free hosting tier, it might take 30-50
                seconds to spin up after inactivity. Hang tight!
              </p>
            </div>

            {/* Skeleton Grid matching PostCard styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {[1, 2, 3].map((skeleton) => (
                <div
                  key={skeleton}
                  className="relative flex flex-col bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden h-[340px] animate-pulse"
                >
                  <div className="w-full h-32 bg-slate-200 dark:bg-slate-800"></div>
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                    <div className="mt-auto pt-4">
                      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : posts.length > 0 ? (
          /* Loaded Posts Grid */
          <div className="flex flex-col gap-10 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white tracking-tight">
              Recent Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Link
                to="/blogs"
                className="px-8 py-3 text-cyan-600 dark:text-cyan-400 font-semibold border-2 border-cyan-500/30 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all shadow-sm focus:ring-4 focus:ring-cyan-500/20 outline-none"
              >
                View all articles
              </Link>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <p className="text-xl font-medium text-slate-500 dark:text-slate-400">
              No articles published yet.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
