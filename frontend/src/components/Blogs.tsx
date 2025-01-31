import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

type PostType = {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

const Blogs = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (totalPosts > posts.length) setShowMore(true);
    else setShowMore(false);
  }, [posts, totalPosts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/get-posts`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          return;
        }

        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
      } catch (err: any) {}
    };

    fetchPosts();
  }, []);

  const handleShowMore = async () => {
    const startInd = posts.length;

    try {
      const response = await axios.get(
        `http://localhost:5000/posts/get-posts/?startInd=${startInd}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      setPosts((prev) => [...prev, ...data.posts]);
      setTotalPosts(data.totalPosts);
    } catch (err: any) {}
  };

  return (
    <div className="min-h-screen">
      <div className="p-7 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8">
        {!loading && posts.length === 0 && (
          <p className="text-xl">No posts found</p>
        )}
        {loading && <Spinner size="md" />}
        {!loading &&
          posts.length > 0 &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      {showMore && (
        <Button
          color="gray"
          className="max-w-6xl mx-auto text-teal-500 self-center text-sm my-7"
          onClick={handleShowMore}
        >
          Show more
        </Button>
      )}
    </div>
  );
};

export default Blogs;
