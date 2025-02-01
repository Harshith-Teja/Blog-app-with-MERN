import axios from "axios";
import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { PostType } from "../types/PostType";
import { BASE_URL } from "../api/requestUrl";

const UpdatePost = () => {
  const [formData, setFormData] = useState<Partial<PostType>>({});
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const { postId } = useParams();

  //fetches post details whenever postId changes
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/posts/get-posts?postId=${postId}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (data.success === false) {
          setErrMsg(data.message);
          return;
        }

        setErrMsg("");
        setFormData(data.posts[0]);
      } catch (err: any) {
        setErrMsg(err.message);
      }
    };
    fetchPost();
  }, [postId]);

  //sends the updated post to the server
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${BASE_URL}/posts/update-post/${postId}/${currentUser?._id}`,
        JSON.stringify(formData),
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

      setErrMsg("");
      navigate(`/posts/${data.slug}`); //navigates to the updated post
    } catch (err: any) {
      setErrMsg(err.message);
    }
  };
  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl font-bold my-7">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            id="title"
            placeholder="Title"
            className="flex-1"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="programming">Programming</option>
            <option value="travel">Travel</option>
            <option value="finance">Finance</option>
          </Select>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something"
          className="h-72 mb-12"
          onChange={(value) => setFormData({ ...formData, content: value })}
          value={formData.content}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
        {errMsg && (
          <Alert color="failure" className="mt-2">
            {errMsg}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
