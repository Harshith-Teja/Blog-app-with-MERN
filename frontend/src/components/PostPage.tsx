// import axios from "axios";
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";

const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [post, setPost] = useState<PostType>(); // useState<Partial<PostType>>({});
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
    const onPostFetch = async () => {
      if (mainPostErrorMsg) {
        setErrMsg(mainPostErrorMsg);
        setLoading(false);
        return;
      }

      setErrMsg("");
      setPost(mainPostData?.posts[0]);
      setLoading(mainPostLoading);
    };

    onPostFetch();
    setIsSummary(false); // Reset summary state when the post changes
  }, [slug, mainPostData]);

  //fetches 3 recent posts on every refresh
  useEffect(() => {
    const onRecentPostFetch = async () => {
      if (recentPostErrorMsg) {
        setErrMsg(recentPostErrorMsg);
        setLoading(false);
        return;
      }

      setErrMsg("");
      setRecentPosts(recentPostData.posts);
    };

    onRecentPostFetch();
  }, [recentPostData]);

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

      console.log(data);
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

        console.log("TL;DR generated:", result);
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

  return (
    <>
      {loading ? (
        <main className="flex justify-center items-center min-h-screen">
          <Spinner className="xl" />
        </main>
      ) : (
        <main className="flex flex-col max-w-6xl mx-auto min-h-screen p-3">
          <Alert color="failure" className={errMsg ? "block" : "hidden"}>
            {errMsg}
          </Alert>
          <h1 className="text-3xl lg:text-4xl mt-10 p-3 text-center max-w-2xl mx-auto">
            {post?.title}
          </h1>
          <Button color="gray" pill size="xs" className="self-center mt-5">
            <Link to={`/search?category=${post?.category}`}>
              {post?.category}
            </Link>
          </Button>
          <section className="flex justify-between p-3 border-b border-slate-500 w-full max-w-2xl mx-auto text-xs">
            <span>
              {new Date(post?.createdAt as string).toLocaleDateString()}
            </span>
            <span className="italic">
              {post?.content && (post?.content.length / 1000).toFixed(0)} mins
              read
            </span>
          </section>
          <section
            className="p-3 w-full max-w-3xl mx-auto post-content"
            dangerouslySetInnerHTML={{ __html: post?.content as string }}
          ></section>
          <section className="p-3 w-full max-w-3xl mx-auto post-content">
            {/* turns the like red as soons as the user likes and vice versa */}
            <button
              className={`${
                post?.likes && post?.likes.includes(currentUser?._id as string)
                  ? "text-red-500 text-2xl mr-3 transition-colors duration-300"
                  : "text-gray-300 hover:text-red-500 text-2xl mr-3 transition-colors duration-300"
              }`}
              onClick={() => likePost(post!._id)}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <span className="text-gray-400 text-lg">
              {(post?.numOfLikes as number) > 0 &&
                post?.numOfLikes +
                  " " +
                  (post?.numOfLikes && post?.numOfLikes > 1 ? "likes" : "like")}
            </span>
            <section className="w-full max-w-3xl mx-auto my-8">
              {/* The AI Button */}
              <button
                onClick={fetchTLDR}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {/* A spark/lightning icon to indicate AI */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate TL;DR
              </button>

              {/* The Summary Callout Box */}
              {isSummaryLoading ? (
                <div className="flex justify-center items-center mt-6 py-4">
                  <Spinner className="xl" />
                </div>
              ) : (
                isSummary && (
                  <div className="mt-6 p-5 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden transition-all duration-300 ease-in-out">
                    {/* Subtle left accent line to indicate a quote/summary block */}
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-purple-600"></div>

                    <h3 className="text-xs font-bold text-purple-800 mb-2 uppercase tracking-wider">
                      ✨ AI Summary
                    </h3>

                    {/* The actual summary text */}
                    <div
                      className="text-gray-700 leading-relaxed text-md post-content"
                      dangerouslySetInnerHTML={{
                        __html: post?.summary as string,
                      }}
                    ></div>
                  </div>
                )
              )}
            </section>
          </section>
          {post?._id && <CommentSection postId={post?._id as string} />}

          <section className="flex flex-col justify-between items-center my-5">
            <h1 className="text-xl my-5">Recent articles</h1>
            <div className="flex flex-col sm:flex-row gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post?._id} post={post} />
              ))}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default PostPage;
