import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "flowbite-react";
import { Link } from "react-router-dom";

type PostType = {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  updatedAt: string;
};
const DashPosts = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [userPosts, setPosts] = useState<PostType[]>([]);

  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/get-posts/${currentUser?._id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          return;
        }

        setPosts(data.posts);
      } catch (err: any) {}
    };

    fetchPosts();
  }, [currentUser?._id]);
  return (
    <div className="table-auto md:mx-auto overflow-x-scroll p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userPosts.length > 0 ? (
        <>
          <Table hoverable className="md">
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
                <Table.Row className="dark:text-white">
                  <Table.Cell>
                    {new Date(post?.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
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
        </>
      ) : (
        <p>No posts available!!</p>
      )}
    </div>
  );
};

export default DashPosts;
