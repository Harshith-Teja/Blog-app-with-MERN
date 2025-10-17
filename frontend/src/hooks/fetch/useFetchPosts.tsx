import axios from "axios";
import { useEffect, useState } from "react";

const useFetchPosts = (url: string, dependencies: any[] = []) => {
  const [data, setData] = useState({
    posts: [],
    totalPosts: 0,
    lastMonthPosts: 0,
  });
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const response = await axios.get(url, {
          withCredentials: true,
        });

        const data = response.data;

        if (data.success === false) {
          setPostsLoading(false);
          console.log(data.message);
          return;
        }

        setData(data);
        setPostsLoading(false);
      } catch (err: any) {
        setPostsLoading(false);
        console.log(err.message);
      }
    };

    fetchPosts();
  }, [url, ...dependencies]);

  return { data, postsLoading };
};

export default useFetchPosts;
