import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import axios from "axios";

const CommentSection = ({ postId }: { postId: string }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/comments/create-comment`,
        JSON.stringify({ content: comment, postId, userId: currentUser?._id }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        setErrMsg(data.message);
        return;
      }

      setComment("");
      setErrMsg("");
    } catch (err: any) {
      setErrMsg(err.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <section className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Signed in as: </p>
          <img
            src={currentUser.profilePic}
            alt={currentUser.uname}
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{currentUser.uname}
          </Link>
        </section>
      ) : (
        <section>
          <p>You must be signed in to comment</p>
          <Link to={"/login"}>Sign in</Link>
        </section>
      )}

      {currentUser && (
        <form
          className="border border-slate-700 p-3 rounded-md"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-sm">
              {200 - comment.length} characters remaining
            </p>
            <Button gradientDuoTone="purpleToBlue" outline type="submit">
              Submit
            </Button>
          </div>
          <Alert color="failure" className={errMsg ? "block mt-4" : "hidden"}>
            {errMsg}
          </Alert>
        </form>
      )}
    </div>
  );
};

export default CommentSection;
