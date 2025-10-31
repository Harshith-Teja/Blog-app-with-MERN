import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const useFetchPosts = (url: string, dependencies: any[] = []) => {
  const [postsData, setPostsData] = useState({
    posts: [],
    totalPosts: 0,
    lastMonthPosts: 0,
  });
  const [postsLoading, setPostsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      setPostsLoading(true);

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        });

        const data = response.data;

        if (data.success === false) {
          setPostsLoading(false);
          console.log(data.message);
          return;
        }

        setPostsData(data);
        setPostsLoading(false);
      } catch (err: any) {
        setPostsLoading(false);
        setErrorMsg(err.message);
        console.log(err.message);
      }
    };

    fetchPosts();
  }, [url, ...dependencies]);

  return { postsData, postsLoading, errorMsg };
};

export default useFetchPosts;
