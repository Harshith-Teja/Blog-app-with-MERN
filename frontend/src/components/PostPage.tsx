import axios from "axios";
import { Alert, Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CommentSection from "./CommentSection";

type PostType = {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [post, setPost] = useState<Partial<PostType>>({});

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:5000/posts/get-posts?slug=${slug}`,
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
        </main>
      )}
    </>
  );
};

export default PostPage;
