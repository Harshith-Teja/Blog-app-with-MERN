import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faComment,
  faFile,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { PostType } from "../types/PostType";
import { CommentType } from "../types/CommentType";
import { BASE_URL } from "../api/requestUrl";

const DashboardComp = () => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalLastMonthComments, setTotalLastMonthComments] = useState(0);
  const [totalLastMonthPosts, setTotalLastMonthPosts] = useState(0);
  const [totalLastMonthLikes, setTotalLastMonthLikes] = useState(0);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  //fetches posts, comments and likes whenever the user changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setCommentsLoading(true);

        const response = await axios.get(
          `${BASE_URL}/comments/get-all-comments/?userId=${currentUser?._id}`,
          {
            withCredentials: true,
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
        setTotalLastMonthComments(data.totalLastMonthComments);
        setCommentsLoading(false);
      } catch (err: any) {
        console.log(err.message);
        setCommentsLoading(false);
      }
    };

    fetchComments();

    const fetchPosts = async () => {
      try {
        setPostsLoading(true);

        const response = await axios.get(
          `${BASE_URL}/posts/get-posts/?userId=${currentUser?._id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          console.log(data.message);
          setPostsLoading(false);
          return;
        }

        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setTotalLastMonthPosts(data.lastMonthPosts);
        setPostsLoading(false);
      } catch (err: any) {
        console.log(err.message);
        setPostsLoading(false);
      }
    };

    fetchPosts();

    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/comments/get-all-likes/?userId=${currentUser?._id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        if (data.success === false) {
          console.log(data.message);
          return;
        }

        setTotalLikes(data.totalLikes);
        setTotalLastMonthLikes(data.totalLastMonthLikes);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchLikes();
  }, [currentUser]);

  return (
    <div className="p-3 md:mx-auto ">
      <div className="flex flex-wrap gap-4 justify-center">
        <article className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full md:w-72 rounded-md shadow-md">
          <section className="flex justify-between">
            <section>
              <h3 className="text-gray-500 text-md uppercase">Total Likes</h3>
              <p className="text-2xl">{totalLikes}</p>
            </section>
            <FontAwesomeIcon
              icon={faHeart}
              className="text-red-500 rounded-full text-3xl p-3 shadow-lg"
            />
          </section>
          <section className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
              {totalLastMonthLikes}
            </span>
            <h3 className="text-gray-500">Last Month</h3>
          </section>
        </article>
        <article className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full md:w-72 rounded-md shadow-md">
          <section className="flex justify-between">
            <section>
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </section>
            <FontAwesomeIcon
              icon={faComment}
              className="text-cyan-500 rounded-full text-3xl p-3 shadow-lg"
            />
          </section>
          <section className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <FontAwesomeIcon icon={faArrowUp} className="mr-2" />
              {totalLastMonthComments}
            </span>
            <h3 className="text-gray-500">Last Month</h3>
          </section>
        </article>
        <article className="flex flex-col p-3 dark:bg-slate-800 gap-4 w-full md:w-72 rounded-md shadow-md">
          <section className="flex justify-between">
            <section>
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </section>
            <FontAwesomeIcon
              icon={faFile}
              className="text-yellow-500 rounded-full text-3xl p-3 shadow-lg"
            />
          </section>
          <section className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <FontAwesomeIcon icon={faArrowUp} className="mr-2" />{" "}
              {totalLastMonthPosts}
            </span>
            <h3 className="text-gray-500">Last Month</h3>
          </section>
        </article>
      </div>
      <div className="flex flex-wrap gap-5 py-3 mx-auto justify-center">
        <article className="flex flex-1 flex-col w-full md:w-auto shadow-md p-4 rounded-md dark:bg-gray-800">
          <section className="flex justify-between p-3 text-sm font-semibold">
            <h1>Recent comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=comments">See All</Link>
            </Button>
          </section>
          <section className="flex justify-center">
            {commentsLoading && <Spinner size="md" />}
          </section>
          {!commentsLoading && comments.length > 0 && (
            <Table hoverable className="shadow-lg rounded-lg">
              <Table.Head>
                <Table.HeadCell className="bg-slate-300">
                  Comment
                </Table.HeadCell>
                <Table.HeadCell className="bg-slate-300">Likes</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {comments.map((comment) => (
                  <Table.Row key={comment._id}>
                    <Table.Cell className="w-96">
                      {" "}
                      <p className="line-clamp-2">{comment.content}</p>{" "}
                    </Table.Cell>
                    <Table.Cell>{comment.numOfLikes}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          {!commentsLoading && comments.length === 0 && (
            <p className="text-center">No comments to display!!</p>
          )}
        </article>
        <article className="flex flex-1 flex-col w-full md:w-auto shadow-md p-4 rounded-md dark:bg-gray-800">
          <section className="flex justify-between p-3 text-sm font-semibold">
            <h1>Recent posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=posts">See All</Link>
            </Button>
          </section>
          <section className="flex justify-center">
            {postsLoading && <Spinner size="md" />}
          </section>
          {!postsLoading && posts.length > 0 && (
            <Table hoverable className="shadow-lg rounded-lg">
              <Table.Head>
                <Table.HeadCell className="bg-slate-300">Title</Table.HeadCell>
                <Table.HeadCell className="bg-slate-300">
                  Category
                </Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {posts.map((post) => (
                  <Table.Row key={post._id}>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          {!postsLoading && posts.length == 0 && (
            <p className="text-center">No posts to display!!</p>
          )}
        </article>
      </div>
    </div>
  );
};

export default DashboardComp;
