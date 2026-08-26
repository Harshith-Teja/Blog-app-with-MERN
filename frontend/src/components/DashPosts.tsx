import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";
import useHandleShowMore from "../hooks/useHandleShowMore";

const DashPosts = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [showMore, setShowMore] = useState<Boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean | undefined>(false);
  const [postIdToDelete, setPostIdToDelete] = useState<String>("");
  const [loading, setLoading] = useState<Boolean>(false);
  const [morePostsLoading, setMorePostsLoading] = useState<Boolean>(false);
  const { postsData, postsLoading } = useFetchPosts(
    `${BASE_URL}/posts/get-posts/?userId=${currentUser?._id}`,
    [currentUser?._id]
  );

  const {
    morePosts: oldAndNewPosts,
    totalPosts: fetchedTotalPosts,
    morePostsLoading: fetchedMorePostsLoading,
    fetchMorePosts,
  } = useHandleShowMore(
    `${BASE_URL}/posts/get-posts/?userId=${currentUser?._id}&`,
    userPosts,
    totalPosts
  );

  //fetches more posts when user clicks 'load more' button
  const handleShowMore = async () => {
    setMorePostsLoading(true);
    await fetchMorePosts();
    setMorePostsLoading(false);
  };

  useEffect(() => {
    setUserPosts(oldAndNewPosts);
    setTotalPosts(fetchedTotalPosts);
    setMorePostsLoading(fetchedMorePostsLoading);
  }, [oldAndNewPosts, fetchedTotalPosts, fetchedMorePostsLoading]);

  //if totalPosts are greater than current posts, enables 'load more' button
  useEffect(() => {
    if (totalPosts > userPosts.length) setShowMore(true);
    else setShowMore(false);
  }, [totalPosts, userPosts]);

  //fetches posts on every refresh of the page
  useEffect(() => {
    const onPostsFetched = async () => {
      setUserPosts(postsData?.posts);
      setTotalPosts(postsData?.totalPosts);
      setLoading(postsLoading);
    };

    onPostsFetched();
  }, [currentUser?._id, postsData]);

  const handleDelete = async () => {
    setShowModal(false);

    try {
      const response = await axios.delete(
        `${BASE_URL}/posts/delete-post/${postIdToDelete}/${currentUser?._id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response.data;

      if (data.success === false) {
        console.log(data?.message);
        return;
      }

      //removes the post from the client side
      setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete)
      );
      setTotalPosts(totalPosts - 1);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full bg-slate-50/50 dark:bg-transparent min-h-screen font-sans">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="mb-8 text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Manage Posts
        </h1>

        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm p-6 overflow-hidden">
          <section className="flex justify-center mt-2">
            {loading && <Spinner size="xl" />}
          </section>

          {!loading && userPosts.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/50">
                <Table hoverable className="shadow-none border-none">
                  <Table.Head className="border-b border-slate-100 dark:border-slate-800/50">
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Date Updated
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Post Title
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Category
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider text-right pr-8">
                      Actions
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {userPosts.map((post) => (
                      <Table.Row
                        className="bg-white dark:bg-transparent"
                        key={post._id}
                      >
                        <Table.Cell className="text-slate-500 dark:text-slate-400 font-medium">
                          {new Date(post?.updatedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </Table.Cell>
                        <Table.Cell className="w-1/3 md:w-1/2">
                          <Link
                            to={`/posts/${post.slug}`}
                            className="text-slate-800 dark:text-slate-200 font-bold hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors line-clamp-2"
                          >
                            {post.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                            {post.category}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-end gap-4 pr-4">
                            <Link
                              to={`/update-post/${post._id}`}
                              className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
                            >
                              Edit
                            </Link>
                            <span
                              className="font-medium text-red-500 hover:underline cursor-pointer"
                              onClick={() => {
                                setShowModal(true);
                                setPostIdToDelete(post._id);
                              }}
                            >
                              Delete
                            </span>
                          </div>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </div>

              {!morePostsLoading && showMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-3 text-cyan-600 dark:text-cyan-400 font-semibold border-2 border-cyan-500/30 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all shadow-sm focus:ring-4 focus:ring-cyan-500/20 outline-none"
                  >
                    Load More
                  </button>
                </div>
              )}
              {morePostsLoading && (
                <section className="flex justify-center mt-8">
                  <Spinner size="md" />
                </section>
              )}
            </>
          )}
          {!loading && userPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                No posts found
              </p>
              <p className="text-slate-500 mt-2">
                You haven't written any articles yet.
              </p>
            </div>
          )}
        </div>

        {showModal && (
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body className="text-center">
              <FontAwesomeIcon
                icon={faCircleExclamation}
                className="w-14 h-14 text-slate-400 dark:text-slate-200 mb-4"
              />
              <h1 className="text-slate-600 dark:text-slate-200 text-lg font-medium mb-6">
                Are you sure you want to delete this post?
              </h1>
              <div className="flex justify-center gap-4">
                <button
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full shadow-sm transition-colors"
                  onClick={handleDelete}
                >
                  Yes, I'm sure
                </button>
                <button
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-full transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  No, cancel
                </button>
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DashPosts;
