import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, Textarea } from "flowbite-react";
import { CommentType } from "../types/CommentType";
import { BASE_URL } from "../api/requestUrl";

type CommentProps = {
  comment: CommentType;
  onLike: (commendId: string) => void;
  onEdit: (comment: CommentType, editedContent: string) => void;
  onDelete: (commendId: string) => void;
};

type User = {
  uname: string;
  pwd: string;
  refreshToken?: string[];
  email?: string;
  profilePic: string;
};

const Comment = ({ comment, onLike, onEdit, onDelete }: CommentProps) => {
  const [user, setUser] = useState<User>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/get-user/${comment.userId}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setUser(data.user);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/comments/edit-comment/${comment._id}`,
        JSON.stringify({ content: editedContent }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setIsEditing(false);
      onEdit(comment, data.editedComment.content);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="mt-5 border-b p-3 flex">
      <section className="mr-4">
        <img
          src={user?.profilePic}
          alt={user?.uname}
          className="w-8 h-8 rounded-full"
        />
      </section>
      <section className="w-full">
        <section className="flex gap-2 items-center">
          <p className="text-sm font-medium">
            {user?.uname ? user?.uname : "Anonymous user"}
          </p>
          <p className="text-xs text-gray-500">
            {comment.updatedAt && comment.updatedAt !== comment.createdAt
              ? "(Edited) " + moment(comment.updatedAt).fromNow()
              : moment(comment.createdAt).fromNow()}
          </p>
        </section>
        {isEditing ? (
          <section className="mt-2">
            <Textarea
              className="mb-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                size="xs"
                gradientDuoTone="purpleToBlue"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size="xs"
                gradientDuoTone="purpleToBlue"
                outline
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </section>
        ) : (
          <section className="mt-2">
            <p className="text-gray-800 dark:text-slate-300">
              {comment.content}
            </p>
            <div className="mt-2 flex gap-2 items-center">
              <button
                className={
                  comment.likes &&
                  comment.likes.includes(currentUser?._id as string)
                    ? "text-red-500"
                    : "text-gray-300 hover:text-red-500 "
                }
                onClick={() => onLike(comment._id)}
              >
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <p className="text-gray-400 text-xs">
                {comment.numOfLikes > 0 &&
                  comment.numOfLikes +
                    " " +
                    (comment.numOfLikes > 1 ? "likes" : "like")}
              </p>
              {currentUser && currentUser._id === comment.userId && (
                <>
                  <button
                    className="text-gray-500 hover:text-blue-500 text-sm"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-500 text-sm"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default Comment;
