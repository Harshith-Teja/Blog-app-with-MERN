import axios from "axios";
import { useEffect, useState } from "react";
import { PostType } from "../types/PostType";

const useHandleShowMore = (
  url: string,
  initialPosts: PostType[],
  initialTotalPosts: number
) => {
  const [morePosts, setMorePosts] = useState<PostType[]>(initialPosts);
  const [totalPosts, setTotalPosts] = useState<number>(initialTotalPosts);
  const [morePostsLoading, setMorePostsLoading] = useState<Boolean>(false);

  useEffect(() => {
    setMorePosts(initialPosts);
    setTotalPosts(initialTotalPosts);
  }, [initialPosts, initialTotalPosts]);

  const fetchMorePosts = async () => {
    const startInd = morePosts.length;

    try {
      setMorePostsLoading(true);

      const response = await axios.get(url + `startInd=${startInd}`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data.success === false) {
        console.log(data?.message);
        setMorePostsLoading(false);
        return;
      }

      setMorePosts((prev) => [...prev, ...data.posts]); //keeps the previous posts intact, and adds new posts
      setTotalPosts(data.totalPosts);
      setMorePostsLoading(false);
    } catch (err: any) {
      console.log(err.message);
      setMorePostsLoading(false);
    }
  };

  return { morePosts, totalPosts, morePostsLoading, fetchMorePosts };
};

export default useHandleShowMore;
