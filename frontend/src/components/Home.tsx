import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "./PostCard";

type PostType = {
  _id: string;
  title: string;
  content: string;
  category: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

const Home = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/posts/get-posts`,
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
  }, []);

  return (
    <div>
      <section className="flex flex-col gap-6 px-3 p-28  max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to Blog Smith
        </h1>
        <p className="text-gray-500 text-sm sm:text-lg">
          Here you'll find a variety of blogs on topics such a programming,
          finance, travel etc...
        </p>
        <Link
          to="/search"
          className="text-sm sm:text-lg text-cyan-500 font-bold hover:underline"
        >
          Search a post
        </Link>
      </section>

      <section className="max-w-7xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-sm sm:text-lg text-cyan-500 text-center font-bold hover:underline"
            >
              View all posts
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
