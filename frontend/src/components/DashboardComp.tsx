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
import { Spinner, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import { PostType } from "../types/PostType";
import { CommentType } from "../types/CommentType";
import { BASE_URL } from "../api/requestUrl";
import useFetchPosts from "../hooks/fetch/useFetchPosts";

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

  const { postsData, postsLoading } = useFetchPosts(
    `${BASE_URL}/posts/get-posts/?userId=${currentUser?._id}`,
    [currentUser]
  );

  //fetches posts, comments and likes whenever the user changes
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
        setTotalLastMonthComments(data.totalLastMonthComments);
        setCommentsLoading(false);
      } catch (err: any) {
        console.log(err.message);
        setCommentsLoading(false);
      }
    };

    fetchComments();

    if (postsData) {
      setPosts(postsData.posts);
      setTotalPosts(postsData.totalPosts);
      setTotalLastMonthPosts(postsData.lastMonthPosts);
    }

    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/posts/get-all-likes/${currentUser?._id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.accessToken}`,
            },
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
  }, [currentUser, postsData]);

  return (
    <div className="p-6 md:p-8 w-full bg-slate-50/50 dark:bg-transparent min-h-screen font-sans">
      {/* Metrics Row */}
      <div className="flex flex-wrap gap-6 justify-evenly mb-8">
        {/* Likes Widget */}
        <article className="relative flex flex-col p-6 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 w-full md:w-[30%] lg:w-72 group">
          <section className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Total Likes
              </h3>
              <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
                {totalLikes}
              </p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-rose-600 text-white shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
              <FontAwesomeIcon icon={faHeart} className="text-2xl" />
            </div>
          </section>
          <section className="flex items-center gap-2 text-sm mt-2">
            <span className="flex items-center text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1 text-xs" />
              {totalLastMonthLikes}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              vs last month
            </span>
          </section>
        </article>

        {/* Comments Widget */}
        <article className="relative flex flex-col p-6 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 w-full md:w-[30%] lg:w-72 group">
          <section className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Comments
              </h3>
              <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
                {totalComments}
              </p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
              <FontAwesomeIcon icon={faComment} className="text-2xl" />
            </div>
          </section>
          <section className="flex items-center gap-2 text-sm mt-2">
            <span className="flex items-center text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1 text-xs" />
              {totalLastMonthComments}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              vs last month
            </span>
          </section>
        </article>

        {/* Posts Widget */}
        <article className="relative flex flex-col p-6 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 w-full md:w-[30%] lg:w-72 group">
          <section className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Total Posts
              </h3>
              <p className="text-4xl font-extrabold text-slate-800 dark:text-white">
                {totalPosts}
              </p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-600 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <FontAwesomeIcon icon={faFile} className="text-2xl" />
            </div>
          </section>
          <section className="flex items-center gap-2 text-sm mt-2">
            <span className="flex items-center text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
              <FontAwesomeIcon icon={faArrowUp} className="mr-1 text-xs" />
              {totalLastMonthPosts}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              vs last month
            </span>
          </section>
        </article>
      </div>

      {/* Tables Row */}
      <div className="flex flex-col lg:flex-row gap-8 justify-center lg:justify-start w-full">
        {/* 'Recent Comments' Table */}
        <article className="flex flex-1 flex-col w-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm p-6">
          <section className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Recent Comments
            </h2>
            <Link
              to="/dashboard?tab=comments"
              className="px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors"
            >
              See All
            </Link>
          </section>

          {commentsLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size="xl" />
            </div>
          ) : comments.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/50">
              <Table hoverable className="shadow-none border-none">
                <Table.Head className="border-b border-slate-100 dark:border-slate-800/50">
                  <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Comment
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Likes
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {comments.map((comment) => (
                    <Table.Row
                      key={comment._id}
                      className="bg-white dark:bg-transparent"
                    >
                      <Table.Cell className="w-96 text-slate-600 dark:text-slate-300 font-medium">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell className="text-slate-500 dark:text-slate-400 font-medium">
                        {comment.numOfLikes}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-10 italic">
              No comments to display yet.
            </p>
          )}
        </article>

        {/* Recent Posts Table */}
        <article className="flex flex-1 flex-col w-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm p-6">
          <section className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Recent Posts
            </h2>
            <Link
              to="/dashboard?tab=posts"
              className="px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 rounded-full hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors"
            >
              See All
            </Link>
          </section>

          {postsLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size="xl" />
            </div>
          ) : posts.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/50">
              <Table hoverable className="shadow-none border-none">
                <Table.Head className="border-b border-slate-100 dark:border-slate-800/50">
                  <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Title
                  </Table.HeadCell>
                  <Table.HeadCell className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    Category
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {posts.map((post) => (
                    <Table.Row
                      key={post._id}
                      className="bg-white dark:bg-transparent"
                    >
                      <Table.Cell className="w-96 text-slate-800 dark:text-slate-200 font-bold">
                        <Link
                          to={`/posts/${post.slug}`}
                          className="hover:text-cyan-500 transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-full">
                          {post.category}
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-10 italic">
              No posts to display yet.
            </p>
          )}
        </article>
      </div>
    </div>
  );
};

export default DashboardComp;
