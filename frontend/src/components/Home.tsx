// import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const { postsData } = useFetchPosts(`${BASE_URL}/posts/get-posts`, []);

  //fetces posts on every refresh of the page
  useEffect(() => {
    const onPostsFetched = async () => {
      setPosts(postsData?.posts);
    };

    onPostsFetched();
  }, [postsData]);

  return (
    <div>
      <section className="relative flex flex-col gap-6 px-4 py-28 max-w-6xl mx-auto items-center text-center bg-gradient-to-br from-blue-200 via-white to-cyan-100 dark:from-[rgb(27,36,62)] dark:via-[rgb(24,36,69)] dark:to-[rgb(19,30,56)] rounded-3xl shadow-sm border border-cyan-100 dark:border-slate-700/50 my-8 overflow-hidden z-0">
        {/* Dark Mode Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-48 bg-cyan-500/10 blur-[80px] rounded-full hidden dark:block pointer-events-none -z-10"></div>

        <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-cyan-900/60 dark:text-cyan-300 dark:border dark:border-cyan-800">
          New & Trending
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
            Blog Smith
          </span>
        </h1>
        <p className="max-w-2xl text-gray-500 text-md sm:text-lg dark:text-slate-400">
          Discover insights on programming, finance, travel, and more. Forge
          your thoughts into powerful posts and share them with the world.
        </p>
        <Link
          to="/search"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800/80 transition-all shadow-lg hover:shadow-cyan-500/50 dark:hover:shadow-cyan-900/50"
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

      <section className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/blogs"
              className="text-sm sm:text-lg text-cyan-500 text-center font-bold hover:underline"
            >
              View all posts
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
