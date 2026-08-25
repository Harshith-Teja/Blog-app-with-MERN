import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { CommentType } from "../types/CommentType";
import { BASE_URL } from "../api/requestUrl";

const CommentSection = ({ postId }: { postId: string }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [postComments, setPostComments] = useState<CommentType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const navigate = useNavigate();

  //fetces comments on the post on every refresh of the page
  useEffect(() => {
    const controller = new AbortController();

    const fetchPostComments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/comments/get-post-comments/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.accessToken}`,
            },
            signal: controller.signal,
          }
        );

        const data = response.data;
        if (data?.success === false) {
          setErrMsg(data?.message);
          return;
        }

        setPostComments(data?.postComments);
        setErrMsg("");
      } catch (err: any) {
        if (axios.isCancel(err)) {
          // Ignore errors caused by the cancellation
          console.log("Request canceled", err.message);
          return;
        }
        setErrMsg(err.message);
        console.log(err.message);
      }
    };

    fetchPostComments();

    return () => {
      // Cleanup function: Cancel the request if component unmounts
      controller.abort();
    };
  }, [postId]);

  //adds like on the comment when a user likes it
  const handleLike = async (commentId: string) => {
    try {
      if (currentUser === null) {
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/comments/like-comment/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success === false) {
        setErrMsg(data?.message);
        return;
      }

      //updates the likes of the comments on the client's side
      setPostComments(
        postComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                likes: data?.comment?.likes,
                numOfLikes: data?.comment?.numOfLikes,
              }
            : comment
        )
      );
      setErrMsg("");
    } catch (err: any) {
      setErrMsg(err.message);
      console.log(err.message);
    }
  };

  //updates the comment's section to display the new comment after editing it
  const handleEdit = (comment: CommentType, editedContent: string) => {
    setPostComments(
      postComments.map((cmnt) =>
        cmnt._id === comment._id ? { ...cmnt, content: editedContent } : cmnt
      )
    );
  };

  //deletes the comment
  const handleDelete = async (commentId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(
        `${BASE_URL}/comments/delete-comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response?.data;
      if (data?.success === false) {
        setErrMsg(data?.message);
        return;
      }

      //updates the client's side to remove deleted comment
      setPostComments(
        postComments.filter((comment) => comment._id !== commentId)
      );
      setShowModal(false);
    } catch (err: any) {
      setErrMsg(err.message);
      console.log(err.message);
    }
  };

  //create a comment
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${BASE_URL}/comments/create-comment`,
        JSON.stringify({ content: comment, postId, userId: currentUser?._id }),
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response?.data;

      if (data?.success === false) {
        setErrMsg(data?.message);
        return;
      }

      setPostComments([data?.newComment, ...postComments]); //adds the new comment to the client side
      setComment("");
      setErrMsg("");
    } catch (err: any) {
      setErrMsg(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-3 font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Discussion ({postComments.length})
        </h2>
      </div>

      {currentUser ? (
        <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm mb-8">
          <section className="flex items-center gap-2 mb-4 text-slate-500 text-sm">
            <p>Commenting as:</p>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-full">
              <img
                src={currentUser.profilePic}
                alt={currentUser.uname}
                className="h-5 w-5 object-cover rounded-full border border-slate-300 dark:border-slate-600"
              />
              <Link
                to={"/dashboard?tab=profile"}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                @{currentUser.uname}
              </Link>
            </div>
          </section>

          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="What are your thoughts?"
              rows={3}
              maxLength={200}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full resize-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-cyan-500 focus:border-cyan-500 rounded-xl"
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-slate-400 text-xs font-medium">
                {200 - comment.length} characters remaining
              </p>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Submit
              </button>
            </div>
            <Alert color="failure" className={errMsg ? "block mt-4" : "hidden"}>
              {errMsg}
            </Alert>
          </form>
        </div>
      ) : (
        <section className="flex items-center gap-2 my-5 text-slate-500 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm">
          <p>Join the conversation!</p>
          <Link
            to={"/login"}
            className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
          >
            Sign in to comment
          </Link>
        </section>
      )}

      {postComments.length === 0 ? (
        <p className="text-sm text-slate-500 italic text-center py-10">
          No comments yet. Be the first to share your thoughts!
        </p>
      ) : (
        <section className="flex flex-col gap-4">
          {postComments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId) => {
                setShowModal(true);
                setCommentIdToDelete(commentId);
              }}
            />
          ))}
        </section>
      )}

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
              <Button
                color="failure"
                className="rounded-full px-4"
                onClick={() => handleDelete(commentIdToDelete)}
              >
                Yes, delete it
              </Button>
              <Button
                color="gray"
                className="rounded-full px-4"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default CommentSection;
