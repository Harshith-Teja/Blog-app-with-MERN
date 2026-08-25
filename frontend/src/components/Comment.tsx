import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Textarea } from "flowbite-react";
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

  //fetces commented user details on every refresh of the page
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/users/get-user/${comment.userId}`,
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
        setUser(data.user);
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchUser();
  }, []);

  //enables the editing section to edit the comment and save it
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  //saves the edited comment's content to server(backend)
  const handleSave = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/comments/edit-comment/${comment._id}`,
        JSON.stringify({ content: editedContent }),
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
        }
      );

      const data = response.data;

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setIsEditing(false); //closes editing section on success
      onEdit(comment, data.editedComment.content); //sends a call to update the comment's section to display the new comment
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex gap-4 p-5 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl shadow-sm transition-all hover:shadow-md">
      <section className="flex-shrink-0">
        <img
          src={
            user?.profilePic
              ? user.profilePic
              : "https://tse4.mm.bing.net/th?id=OIP.4Q7-yMnrlnqwR4ORH7c06AHaHa&pid=Api&P=0&h=180"
          }
          alt={user?.uname[0].toUpperCase() || "A"}
          className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 shadow-sm"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://tse4.mm.bing.net/th?id=OIP.4Q7-yMnrlnqwR4ORH7c06AHaHa&pid=Api&P=0&h=180";
          }}
        />
      </section>

      <section className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {user?.uname ? `@${user.uname}` : "Anonymous user"}
          </p>
          <span className="text-xs text-slate-400 font-medium">·</span>
          <p className="text-xs text-slate-400 font-medium">
            {/* displays edited tag on the comment after it's been edited */}
            {comment.updatedAt && comment.updatedAt !== comment.createdAt
              ? "Edited " + moment(comment.updatedAt).fromNow()
              : moment(comment.createdAt).fromNow()}
          </p>
        </div>

        {isEditing ? (
          <section className="mt-3">
            <Textarea
              className="mb-3 w-full bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-cyan-500 rounded-xl"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow hover:shadow-md transition-all"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-1">
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  className={`transition-colors duration-200 ${
                    comment.likes &&
                    comment.likes.includes(currentUser?._id as string)
                      ? "text-red-500 hover:text-red-600"
                      : "text-slate-400 hover:text-red-500"
                  }`}
                  onClick={() => onLike(comment._id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                  {comment.numOfLikes > 0 && comment.numOfLikes}
                </p>
              </div>

              {currentUser && currentUser._id === comment.userId && (
                <div className="flex gap-3">
                  <button
                    className="text-slate-400 hover:text-cyan-500 text-xs font-medium transition-colors"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className="text-slate-400 hover:text-red-500 text-xs font-medium transition-colors"
                    onClick={() => onDelete(comment._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default Comment;
