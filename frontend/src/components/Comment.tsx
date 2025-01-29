import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

type CommentType = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes?: Array<String>;
  numOfLikes?: Number;
  createdAt?: string;
};

type CommentProps = {
  comment: CommentType;
};

type User = {
  uname: string;
  pwd: string;
  refreshToken?: string[];
  email?: string;
  profilePic: string;
};

const Comment = ({ comment }: CommentProps) => {
  const [user, setUser] = useState<User>();

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
        console.log(data);
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
        </section>
      </section>
    </div>
  );
};

export default Comment;
