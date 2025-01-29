import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type CommentType = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes?: Array<String>;
  numOfLikes: number;
  createdAt?: string;
};

type CommentProps = {
  comment: CommentType;
  handleLike: (commendId: string) => void;
};

type User = {
  uname: string;
  pwd: string;
  refreshToken?: string[];
  email?: string;
  profilePic: string;
};

const Comment = ({ comment, handleLike }: CommentProps) => {
  const [user, setUser] = useState<User>();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/users/get-user/${comment.userId}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        setUser(data.user);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="mt-5 border-b p-3 flex">
      <section className="mr-4">
        <img
          src={user?.profilePic}
          alt={user?.uname}
          className="w-8 h-8 rounded-full"
        />
      </section>
      <section>
        <section className="flex gap-2 items-center">
          <p className="text-sm font-medium">
            {user?.uname ? user?.uname : "Anonymous user"}
          </p>
          <p className="text-xs text-gray-500">
            {moment(comment.createdAt).fromNow()}
          </p>
        </section>
        <section className="mt-2">
          <p className="text-gray-800">{comment.content}</p>
          <div className="mt-2 flex gap-2 items-center">
            <button
              className={
                comment.likes &&
                comment.likes.includes(currentUser?._id as string)
                  ? "text-red-500"
                  : "text-gray-300 hover:text-red-500 "
              }
              onClick={() => handleLike(comment._id)}
            >
              <FontAwesomeIcon icon={faHeart} />
            </button>
            <p className="text-gray-400 text-xs">
              {comment.numOfLikes > 0 &&
                comment.numOfLikes +
                  " " +
                  (comment.numOfLikes > 1 ? "likes" : "like")}
            </p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Comment;
