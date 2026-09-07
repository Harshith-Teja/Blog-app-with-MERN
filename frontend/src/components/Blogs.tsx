import { Spinner } from "flowbite-react";
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
    setPosts(postsData?.posts || []);
    setTotalPosts(postsData?.totalPosts || 0);
  }, [postsData]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-transparent py-12 relative overflow-hidden font-sans">
      {/* Subtle Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-400/20 dark:bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Explore All Articles
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Dive into our latest thoughts, tutorials, and insights across
            programming, finance, and travel.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          {!postsLoading && posts.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-3xl w-full max-w-2xl mx-auto shadow-sm">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                No posts found
              </p>
              <p className="text-slate-500 mt-2">
                Check back later for new content!
              </p>
            </div>
          )}
          {postsLoading && (
            /* Shimmer UI & Waking Server Message */
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col items-center justify-center mb-12 text-center animate-pulse">
                <Spinner
                  size="xl"
                  className="mb-4 text-cyan-500 fill-blue-600"
                />
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">
                  Waking up the server...
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">
                  Because this app uses a free hosting tier, it might take 30-50
                  seconds to spin up after inactivity. Hang tight!
                </p>
              </div>

              {/* Skeleton Grid matching PostCard styling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {[1, 2, 3].map((skeleton) => (
                  <div
                    key={skeleton}
                    className="relative flex flex-col bg-white dark:bg-white/[0.02] backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden h-[340px] animate-pulse"
                  >
                    <div className="w-full h-32 bg-slate-200 dark:bg-slate-800"></div>
                    <div className="p-5 flex flex-col gap-4 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                      <div className="mt-auto pt-4">
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!postsLoading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>

        {/* Upgraded Load More Button */}
        {!morePostsLoading && showMore && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleShowMore}
              className="px-8 py-3 text-cyan-600 dark:text-cyan-400 font-semibold border-2 border-cyan-500/30 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all shadow-sm focus:ring-4 focus:ring-cyan-500/20 outline-none"
            >
              Load More Articles
            </button>
          </div>
        )}

        {morePostsLoading && (
          <section className="flex justify-center mt-16">
            <Spinner size="xl" />
          </section>
        )}
      </div>
    </div>
  );
};

export default Blogs;
