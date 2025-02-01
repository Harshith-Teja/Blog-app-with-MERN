import axios from "axios";
import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { PostType } from "../types/PostType";

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

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();

      try {
        const response = await axios.get(
          `http://localhost:5000/posts/get-posts?${searchQuery}`,
          {
            withCredentials: true,
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
      const response = await axios.get(
        `http://localhost:5000/posts/get-posts?${searchQuery}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        return;
      }

      setPosts((prev) => [...prev, ...data.posts]);
      setTotalPosts(data.totalPosts);
    } catch (err: any) {}
  };

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
    <div className="flex flex-col md:flex-row">
      <section className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search"
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="programming">Programming</option>
              <option value="finance">Finance</option>
              <option value="travel">Travel</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToBlue">
            Apply Filters
          </Button>
        </form>
      </section>
      <section className="w-full">
        <h1 className="text-3xl font-semibold border-gray-500 p-3 mt-5">
          Posts results
        </h1>
        <div className="p-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl">No posts found</p>
          )}
          {loading && <Spinner size="md" />}
          {!loading &&
            posts.length > 0 &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <Button
            color="gray"
            className="w-full text-teal-500 self-center text-sm my-7"
            onClick={handleShowMore}
          >
            Show more
          </Button>
        )}
      </section>
    </div>
  );
};

export default Search;
