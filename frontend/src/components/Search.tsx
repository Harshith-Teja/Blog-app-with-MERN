import axios from "axios";
import { Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [morePostsLoading, setMorePostsLoading] = useState(false);

  //if totalPosts are greater than current posts, enables show more button
  useEffect(() => {
    if (totalPosts > posts.length) setShowMore(true);
    else setShowMore(false);
  }, [posts, totalPosts]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    //fetches posts every time search query changes
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();

      try {
        const response = await axios.get(
          `${BASE_URL}/posts/get-posts?${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.accessToken}`,
            },
          }
        );

        const data = response.data;

        if (data.success === false) {
          setLoading(false);
          return;
        }

        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        console.log(err.message);
      }
    };

    fetchPosts();
  }, [location.search]);

  //updates sidebarData everytime one of searchTerm, sort, category changes(in the input field)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.id === "searchTerm") {
      const searchTerm = e.target.value || "";
      setSidebarData({ ...sidebarData, searchTerm });
    }

    if (e.target.id === "sort") {
      const sort = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  //fetches more posts when user clicks 'load more' button
  const handleShowMore = async () => {
    if (!currentUser) {
      //if the user is not logged in, redirect to login page
      navigate("/login");
      return;
    }

    const startInd = "" + posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startInd", startInd);

    const searchQuery = urlParams.toString();

    try {
      setMorePostsLoading(true);

      const response = await axios.get(
        `${BASE_URL}/posts/get-posts?${searchQuery}`,
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

      setPosts((prev) => [...prev, ...data.posts]);
      setTotalPosts(data.totalPosts);
      setMorePostsLoading(false);
    } catch (err: any) {
      console.log(err.message);
      setMorePostsLoading(false);
    }
  };

  //updates searchquery everytime filter is submitted(one of searchTerm, sort, category changes)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm.trim() || "");
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-950 min-h-screen">
      {/* Sidebar */}
      <section className="w-full md:w-80 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 md:min-h-screen flex-shrink-0">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Search Term
            </label>
            <TextInput
              placeholder="Keywords..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className="shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Sort By
            </label>
            <Select
              id="sort"
              value={sidebarData.sort}
              onChange={handleChange}
              className="shadow-sm"
            >
              <option value="desc">Latest First</option>
              <option value="asc">Oldest First</option>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Category
            </label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
              className="shadow-sm"
            >
              <option value="uncategorized">All Categories</option>
              <option value="programming">Programming</option>
              <option value="finance">Finance</option>
              <option value="travel">Travel</option>
            </Select>
          </div>

          <button
            type="submit"
            className="mt-4 w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Apply Filters
          </button>
        </form>
      </section>

      {/* Main Content Area */}
      <section className="w-full p-6 md:p-10 lg:p-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
          Explore Articles
        </h1>

        <div className="flex justify-center mt-5">
          {loading && <Spinner size="xl" />}
          {!loading && posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                No posts found
              </p>
              <p className="text-slate-500 mt-2">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>

        {/* Load More Button */}
        {!morePostsLoading && showMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleShowMore}
              className="px-8 py-3 text-cyan-600 dark:text-cyan-400 font-semibold border-2 border-cyan-500/30 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all shadow-sm focus:ring-4 focus:ring-cyan-500/20 outline-none"
            >
              Load More Articles
            </button>
          </div>
        )}

        {morePostsLoading && (
          <section className="flex justify-center mt-12">
            <Spinner size="xl" />
          </section>
        )}
      </section>
    </div>
  );
};

export default Search;
