import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
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

  //if totalComments are greater than current comments, enables show more button
  useEffect(() => {
    if (totalComments > comments.length) setShowMore(true);
    else setShowMore(false);
  }, [totalComments, comments]);

  //fetches all comments on all the posts of the current user
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/comments/get-all-comments/?userId=${currentUser?._id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setComments(data.allComments);
        setTotalComments(data.totalComments);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchComments();
  }, []);

  //fetches more comments when user clicks 'show more' button
  const handleShowMore = async () => {
    const startInd = comments.length;

    try {
      const response = await axios.get(
        `${BASE_URL}/comments/get-all-comments/?userId=${currentUser?._id}&startInd=${startInd}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      setComments((prev) => [...prev, ...data.comments]); //keeps the previous comments intact, and adds new comments
      setTotalComments(data.totalComments);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  //deletes the comment
  const handleDelete = async () => {
    setShowModal(false);

    try {
      const response = await axios.delete(
        `${BASE_URL}/comments/delete-comment/${commentIdToDelete}`,
        {
          withCredentials: true,
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
    <div className=" w-full table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>userId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row className="dark:text-white" key={comment._id}>
                  <Table.Cell>
                    {new Date(
                      comment?.updatedAt as string
                    ).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postId}</Table.Cell>
                  <Table.Cell>{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <Button
              color="gray"
              className="w-full text-teal-500 self-center text-sm my-7"
              onClick={handleShowMore}
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <p>No comments available!!</p>
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
              className="w-14 h-14 text-gray-500 dark:text-gray-200 mb-4"
            />
            <h1 className="text-gray-500 dark:text-gray-200 text-lg mb-4">
              Are you sure you want to delete this post?
            </h1>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashComments;
