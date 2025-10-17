import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";

const Blogs = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const [morePostsLoading, setMorePostsLoading] = useState(false);
  const { data, postsLoading } = useFetchPosts(
    `${BASE_URL}/posts/get-posts`,
    []
  );

  //if totalPosts are greater than current posts, enables show more button
  useEffect(() => {
    if (totalPosts > posts.length) setShowMore(true);
    else setShowMore(false);
  }, [posts, totalPosts]);

  //fetces posts on every refresh of the page
  useEffect(() => {
    setPosts(data.posts);
    setTotalPosts(data.totalPosts);
  }, [data]);

  //fetches more posts when user clicks 'show more' button
  const handleShowMore = async () => {
    const startInd = posts.length;

    try {
      setMorePostsLoading(true);

      const response = await axios.get(
        `${BASE_URL}/posts/get-posts/?startInd=${startInd}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        console.log(data?.message);
        setMorePostsLoading(false);
        return;
      }

      setPosts((prev) => [...prev, ...data.posts]); //keeps the previous posts intact, and adds new posts
      setTotalPosts(data.totalPosts);
      setMorePostsLoading(false);
    } catch (err: any) {
      console.log(err.message);
      setMorePostsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-center mt-12">
        {!postsLoading && posts.length === 0 && (
          <p className="text-xl">No posts found!</p>
        )}
        {postsLoading && <Spinner size="md" />}
      </div>
      <div className="p-7 max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8">
        {!postsLoading &&
          posts.length > 0 &&
          posts.map((post) => <PostCard key={post._id} post={post} />)}
      </div>
      {!morePostsLoading && showMore && (
        <Button
          color="gray"
          className="max-w-6xl mx-auto text-teal-500 self-center text-sm my-7"
          onClick={handleShowMore}
        >
          Show more
        </Button>
      )}
      {morePostsLoading && (
        <section className="flex justify-center mt-5">
          <Spinner size="md" />
        </section>
      )}
    </div>
  );
};

export default Blogs;
