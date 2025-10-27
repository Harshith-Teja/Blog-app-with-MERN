// import axios from "axios";
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";

const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [post, setPost] = useState<Partial<PostType>>({});
  const [recentPosts, setRecentPosts] = useState<PostType[]>([]);
  const {
    postsData: mainPostData,
    postsLoading: mainPostLoading,
    errorMsg: mainPostErrorMsg,
  } = useFetchPosts(`${BASE_URL}/posts/get-posts?slug=${slug}`, [slug]);
  const { postsData: recentPostData, errorMsg: recentPostErrorMsg } =
    useFetchPosts(`${BASE_URL}/posts/get-posts?limit=3`, []);

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
          <CommentSection postId={post?._id as string} />

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
