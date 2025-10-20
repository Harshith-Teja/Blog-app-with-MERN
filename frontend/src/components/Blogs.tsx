import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";
import useHandleShowMore from "../hooks/useHandleShowMore";

const Blogs = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [showMore, setShowMore] = useState<Boolean>(false);

  const [morePostsLoading, setMorePostsLoading] = useState<Boolean>(false);
  const { postsData, postsLoading } = useFetchPosts(
    `${BASE_URL}/posts/get-posts`,
    []
  );

  const {
    morePosts: oldAndNewPosts,
    totalPosts: fetchedTotalPosts,
    morePostsLoading: fetchedMorePostsLoading,
    fetchMorePosts,
  } = useHandleShowMore(`${BASE_URL}/posts/get-posts/?`, posts, totalPosts);

  //fetches more posts when user clicks 'show more' button
  const handleShowMore = async () => {
    setMorePostsLoading(true);
    await fetchMorePosts();
    setMorePostsLoading(false);
  };

  useEffect(() => {
    setPosts(oldAndNewPosts);
    setTotalPosts(fetchedTotalPosts);
    setMorePostsLoading(fetchedMorePostsLoading);
  }, [oldAndNewPosts, fetchedTotalPosts, fetchedMorePostsLoading]);

  //if totalPosts are greater than current posts, enables show more button
  useEffect(() => {
    if (totalPosts > posts.length) setShowMore(true);
    else setShowMore(false);
  }, [posts, totalPosts]);

  //fetces posts on every refresh of the page
  useEffect(() => {
    setPosts(postsData.posts);
    setTotalPosts(postsData.totalPosts);
  }, [postsData]);

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
