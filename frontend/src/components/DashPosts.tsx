import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";

const DashPosts = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  //if totalPosts are greater than current posts, enables show more button
  useEffect(() => {
    if (totalPosts > userPosts.length) setShowMore(true);
    else setShowMore(false);
  }, [totalPosts, userPosts]);

  //fetces posts on every refresh of the page
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/posts/get-posts/?userId=${currentUser?._id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          return;
        }

        setUserPosts(data.posts);
        setTotalPosts(data.totalPosts);
      } catch (err: any) {}
    };

    fetchPosts();
  }, [currentUser?._id]);

  //fetches more posts when user clicks 'show more' button
  const handleShowMore = async () => {
    const startInd = userPosts.length;

    try {
      const response = await axios.get(
        `${BASE_URL}/posts/get-posts/?userId=${currentUser?._id}&startInd=${startInd}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      setUserPosts((prev) => [...prev, ...data.posts]); //keeps the previous posts intact, and adds new posts
      setTotalPosts(data.totalPosts);
    } catch (err: any) {}
  };

  //deletes the post
  const handleDelete = async () => {
    setShowModal(false);

    try {
      const response = await axios.delete(
        `${BASE_URL}/posts/delete-post/${postIdToDelete}/${currentUser?._id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      //removes the post from the client side
      setUserPosts((prev) =>
        prev.filter((post) => post._id !== postIdToDelete)
      );
    } catch (err: any) {}
  };
  return (
    <div className=" w-full table-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row className="dark:text-white" key={post._id}>
                  <Table.Cell>
                    {new Date(post?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-teal-500 hover:underline">
                      <Link to={`/update-post/${post._id}`}>Edit</Link>
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
        <p>No posts available!!</p>
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

export default DashPosts;
