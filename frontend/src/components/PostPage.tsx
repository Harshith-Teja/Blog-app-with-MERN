import { Alert, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";

// Category gradient mapping
const getCategoryGradient = (category: string = "uncategorized") => {
  switch (category.toLowerCase()) {
    case "programming":
      return "from-indigo-500 via-purple-500 to-fuchsia-500";
    case "finance":
      return "from-emerald-400 via-teal-500 to-cyan-600";
    case "travel":
      return "from-sky-400 via-blue-500 to-indigo-600";
    default:
      return "from-slate-400 to-slate-600 dark:from-slate-700 dark:to-slate-800";
  }
};

const PostPage = () => {
  const { slug } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [post, setPost] = useState<PostType>();
  const [recentPosts, setRecentPosts] = useState<PostType[]>([]);

  const {
    postsData: mainPostData,
    postsLoading: mainPostLoading,
    errorMsg: mainPostErrorMsg,
  } = useFetchPosts(`${BASE_URL}/posts/get-posts?slug=${slug}`, [slug]);

  const { postsData: recentPostData, errorMsg: recentPostErrorMsg } =
    useFetchPosts(`${BASE_URL}/posts/get-posts?limit=3`, []);

  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isSummary, setIsSummary] = useState(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const navigate = useNavigate();

  //fetches the post on every refresh
  useEffect(() => {
    if (mainPostErrorMsg) {
      setErrMsg(mainPostErrorMsg);
      return;
    }

    if (mainPostData?.posts?.length > 0) {
      setErrMsg("");
      setPost(mainPostData.posts[0]);
    }

    setIsSummary(false);
  }, [slug, mainPostData, mainPostErrorMsg]);

  //fetches 3 recent posts on every refresh
  useEffect(() => {
    if (recentPostErrorMsg) {
      setErrMsg(recentPostErrorMsg);
      return;
    }
    if (recentPostData?.posts) {
      setRecentPosts(recentPostData.posts);
    }
  }, [recentPostData, recentPostErrorMsg]);

  const likePost = async (postId: string) => {
    try {
      if (currentUser === null) {
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/posts/like-post/${postId}/${currentUser._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response.data;
      if (data.success === false) {
        setErrMsg(data.message);
        return;
      }

      setPost(data);
      setErrMsg("");
    } catch (err: any) {
      setErrMsg(err.message);
    }
  };

  const fetchTLDR = () => {
    if (!post?.content) {
      setErrMsg("Post content is empty.");
      setIsSummaryLoading(false);
      return;
    }

    setIsSummaryLoading(true);
    const apiUrl = `${BASE_URL}/blogs/summary/${post?._id}`;

    axios
      .post(apiUrl)
      .then((response) => {
        const result = response?.data?.summary;
        setPost((prevPost) => ({
          ...prevPost!,
          summary: result,
        }));

        setErrMsg("");
        setIsSummaryLoading(false);
        setIsSummary(true);
      })
      .catch((error) => {
        setErrMsg("Failed to generate TL;DR. Please try again later.");
        setIsSummaryLoading(false);
        console.error(error);
      });
  };

  // Improved loading check: Wait until both the loading flag is false AND the post data exists
  const isPostLoading = mainPostLoading || (!post && !errMsg);

  return (
    <main className="flex flex-col mx-auto min-h-screen pb-10 bg-slate-50/50 dark:bg-transparent transition-colors">
      <Alert
        color="failure"
        className={errMsg ? "block max-w-4xl mx-auto mt-5" : "hidden"}
      >
        {errMsg}
      </Alert>

      {isPostLoading ? (
        /* --- PREMIUM SKELETON UI --- */
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0 mt-6 animate-pulse">
          {/* Skeleton Hero Banner */}
          <div className="w-full h-64 md:h-80 lg:h-96 bg-slate-200 dark:bg-slate-800/80 rounded-[2rem] shadow-sm flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800">
            <Spinner size="xl" className="mb-4 text-cyan-500 fill-blue-600" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Fetching article...
            </p>
          </div>

          {/* Skeleton Content Body */}
          <div className="max-w-3xl mx-auto mt-12 px-6 sm:px-0 space-y-5">
            <div className="h-5 bg-slate-200 dark:bg-slate-800/80 rounded-md w-full"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800/80 rounded-md w-11/12"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800/80 rounded-md w-full"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800/80 rounded-md w-4/5"></div>
            <br />
            <div className="h-5 bg-slate-200 dark:bg-slate-800/80 rounded-md w-full"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-800/80 rounded-md w-10/12"></div>

            {/* Skeleton AI Box */}
            <div className="w-full h-32 bg-indigo-50 dark:bg-slate-800/50 rounded-2xl mt-12 border border-slate-100 dark:border-slate-800"></div>
          </div>
        </div>
      ) : (
        /* --- LOADED ARTICLE UI --- */
        <>
          {/* Dynamic Hero Banner */}
          <header className="relative w-full max-w-6xl mx-auto mt-6 rounded-[2rem] overflow-hidden shadow-xl px-4 sm:px-0 animate-fade-in">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(
                post?.category
              )} opacity-95`}
            ></div>
            {/* Subtle dark overlay for text contrast */}
            <div className="absolute inset-0 bg-black/20 dark:bg-black/40 mix-blend-overlay"></div>

            <div className="relative z-10 px-6 py-16 md:py-24 flex flex-col items-center text-center">
              <Link
                to={`/search?category=${post?.category}`}
                className="mb-6 hover:scale-105 transition-transform"
              >
                <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white bg-white/20 backdrop-blur-md rounded-full border border-white/30 shadow-sm">
                  {post?.category || "General"}
                </span>
              </Link>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-4xl leading-tight mb-6 drop-shadow-md">
                {post?.title}
              </h1>

              <div className="flex items-center gap-3 text-sm font-medium text-white/90 bg-black/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                <span>
                  {new Date(post?.createdAt as string).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                <span className="italic">
                  {post?.content ? (post.content.length / 1000).toFixed(0) : 0}{" "}
                  min read
                </span>
              </div>
            </div>
          </header>

          {/* Enhanced Content Section */}
          <section
            className="p-6 md:p-8 w-full max-w-3xl mx-auto post-content mt-8 text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-serif animate-fade-in"
            dangerouslySetInnerHTML={{ __html: post?.content as string }}
          ></section>

          <section className="p-4 w-full max-w-3xl mx-auto post-content border-b border-slate-200 dark:border-slate-700/50 pb-10">
            {/* Interactions */}
            <div className="flex items-center gap-3 mb-10 bg-white dark:bg-slate-800/50 p-4 rounded-2xl w-fit border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <button
                className={`${
                  post?.likes &&
                  post?.likes.includes(currentUser?._id as string)
                    ? "text-red-500 text-3xl hover:scale-110 transition-transform duration-300"
                    : "text-slate-400 hover:text-red-500 text-3xl hover:scale-110 transition-transform duration-300"
                }`}
                onClick={() => likePost(post!._id)}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <span className="text-slate-600 dark:text-slate-400 font-medium text-lg pr-2">
                {(post?.numOfLikes as number) > 0
                  ? `${post?.numOfLikes} ${
                      post?.numOfLikes === 1 ? "like" : "likes"
                    }`
                  : "Be the first to like"}
              </span>
            </div>

            {/* AI Section */}
            <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 shadow-inner">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faWandMagicSparkles}
                      className="text-purple-500"
                    />
                    AI Summary
                  </h3>
                  <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
                    Get a quick breakdown of this article.
                  </p>
                </div>
                <button
                  onClick={fetchTLDR}
                  disabled={isSummaryLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSummaryLoading ? <Spinner size="sm" /> : "Generate TL;DR"}
                </button>
              </div>

              {isSummary && (
                <div className="mt-4 p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl border border-white/40 dark:border-slate-700 shadow-sm animate-fade-in">
                  <div
                    className="text-slate-700 dark:text-slate-300 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{
                      __html: post?.summary as string,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </section>

          {/* Comments */}
          <div className="w-full max-w-3xl mx-auto mt-8">
            {post?._id && <CommentSection postId={post?._id as string} />}
          </div>

          {/* Recent Articles */}
          <section className="flex flex-col items-center mt-16 px-4 w-full max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-slate-800 dark:text-slate-200">
              Keep Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {recentPosts.map((post) => (
                <PostCard key={post?._id} post={post} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default PostPage;
