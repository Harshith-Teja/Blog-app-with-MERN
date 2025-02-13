import axios from "axios";
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";

const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [post, setPost] = useState<Partial<PostType>>({});
  const [recentPosts, setRecentPosts] = useState<PostType[]>([]);

  //fetches the post on every refresh
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${BASE_URL}/posts/get-posts?slug=${slug}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          setErrMsg(data.message);
          return;
        }

        setErrMsg("");
        setPost(data.posts[0]);
        setLoading(false);
      } catch (err: any) {
        setErrMsg(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  //fetches 3 recent posts on every refresh
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `${BASE_URL}/posts/get-posts?limit=3`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          return;
        }

        setRecentPosts(data.posts);
      } catch (err: any) {
        setErrMsg(err.message);
      }
    };

    fetchPosts();
  }, []);
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
            {post.title}
          </h1>
          <Button color="gray" pill size="xs" className="self-center mt-5">
            <Link to={`/search?category=${post.category}`}>
              {post.category}
            </Link>
          </Button>
          <section className="flex justify-between p-3 border-b border-slate-500 w-full max-w-2xl mx-auto text-xs">
            <span>
              {new Date(post.createdAt as string).toLocaleDateString()}
            </span>
            <span className="italic">
              {post.content && (post.content.length / 1000).toFixed(0)} mins
              read
            </span>
          </section>
          <section
            className="p-3 w-full max-w-3xl mx-auto post-content"
            dangerouslySetInnerHTML={{ __html: post.content as string }}
          ></section>
          <CommentSection postId={post._id as string} />

          <section className="flex flex-col justify-between items-center my-5">
            <h1 className="text-xl my-5">Recent articles</h1>
            <div className="flex flex-col sm:flex-row gap-6">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        </main>
      )}
    </>
  );
};

export default PostPage;
