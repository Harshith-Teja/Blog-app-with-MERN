import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";

const Blogs = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  //if totalPosts are greater than current posts, enables show more button
  useEffect(() => {
    if (totalPosts > posts.length) setShowMore(true);
    else setShowMore(false);
  }, [posts, totalPosts]);

  //fetces posts on every refresh of the page
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/posts/get-posts`, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
          return;
        }

        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        console.log(err.message);
      }
    };

    fetchPosts();
  }, []);

  //fetches more posts when user clicks 'show more' button
  const handleShowMore = async () => {
    const startInd = posts.length;

    try {
      const response = await axios.get(
        `${BASE_URL}/posts/get-posts/?startInd=${startInd}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      setPosts((prev) => [...prev, ...data.posts]); //keeps the previous posts intact, and adds new posts
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
