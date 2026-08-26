import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Spinner, Table } from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { CommentType } from "../types/CommentType";
import { BASE_URL } from "../api/requestUrl";

const DashComments = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [comments, setComments] = useState<CommentType[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [totalComments, setTotalComments] = useState(0);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [morePostsLoading, setMorePostsLoading] = useState(false);

  //if totalComments are greater than current comments, enables 'Load more articles button
  useEffect(() => {
    if (totalComments > comments.length) setShowMore(true);
    else setShowMore(false);
  }, [totalComments, comments]);

  //fetches all comments on all the posts of the current user
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);
        const response = await axios.get(
          `${BASE_URL}/comments/get-all-comments/?userId=${currentUser?._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.accessToken}`,
            },
          }
        );

        const data = response.data;
        if (data.success === false) {
          console.log(data.message);
          setCommentsLoading(false);
          return;
        }

        setComments(data.allComments);
        setTotalComments(data.totalComments);
        setCommentsLoading(false);
      } catch (err: any) {
        console.log(err.message);
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [currentUser]);

  //fetches more comments when user clicks 'Load more articles' button
  const handleShowMore = async () => {
    const startInd = comments.length;

    try {
      setMorePostsLoading(true);

      const response = await axios.get(
        `${BASE_URL}/comments/get-all-comments/?userId=${currentUser?._id}&startInd=${startInd}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response.data;

      if (data.success === false) {
        console.log(data?.message);
        setMorePostsLoading(false);
        return;
      }

      setComments((prev) => [...prev, ...data.comments]);
      setTotalComments(data.totalComments);
      setMorePostsLoading(false);
    } catch (err: any) {
      console.log(err.message);
      setMorePostsLoading(false);
    }
  };

  //deletes the comment
  const handleDelete = async () => {
    setShowModal(false);

    try {
      const response = await axios.delete(
        `${BASE_URL}/comments/delete-comment/${commentIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      //removes the comment from the client side
      setComments((prev) =>
        prev.filter((post) => post._id !== commentIdToDelete)
      );
      setTotalComments(totalComments - 1);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-6 md:p-8 w-full bg-slate-50/50 dark:bg-transparent min-h-screen font-sans">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="mb-8 text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Manage Comments
        </h1>

        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm p-6 overflow-hidden">
          <section className="flex justify-center mt-2">
            {commentsLoading && <Spinner size="xl" />}
          </section>

          {!commentsLoading && comments.length > 0 && (
            <>
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/50">
                <Table hoverable className="shadow-none border-none">
                  <Table.Head className="border-b border-slate-100 dark:border-slate-800/50">
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Date Updated
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Comment
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider text-center">
                      Likes
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Post ID
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      User ID
                    </Table.HeadCell>
                    <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider text-right pr-8">
                      Actions
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {comments.map((comment) => (
                      <Table.Row
                        className="bg-white dark:bg-transparent"
                        key={comment._id}
                      >
                        <Table.Cell className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                          {new Date(
                            comment?.updatedAt as string
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Table.Cell>
                        <Table.Cell className="w-1/3 md:w-2/5">
                          <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                            {comment.content}
                          </p>
                        </Table.Cell>
                        <Table.Cell className="text-center">
                          <span className="px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                            {comment.numOfLikes}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                            {comment.postId.substring(0, 10)}...
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded border border-slate-100 dark:border-slate-700">
                            {comment.userId.substring(0, 10)}...
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-end pr-4">
                            <button
                              className="font-medium text-red-500 hover:text-red-700 hover:underline transition-colors outline-none"
                              onClick={() => {
                                setShowModal(true);
                                setCommentIdToDelete(comment._id);
                              }}
                            >
                              Delete
                            </button>
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
          {!commentsLoading && comments.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                No comments found
              </p>
              <p className="text-slate-500 mt-2">
                There is no discussion on your posts yet.
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
                Are you sure you want to delete this comment?
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

export default DashComments;
