import axios from "axios";
import { Alert, Select, TextInput } from "flowbite-react";
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
            headers: {
              Authorization: `Bearer ${currentUser?.accessToken}`,
            },
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
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
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
    <div className="p-6 md:p-10 w-full bg-slate-50/50 dark:bg-transparent min-h-screen font-sans">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="mb-8 text-center text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Edit Article
        </h1>

        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm p-6 md:p-10">
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Article Title
                </label>
                <TextInput
                  type="text"
                  id="title"
                  placeholder="Enter a captivating title..."
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="shadow-sm"
                />
              </div>
              <div className="sm:w-1/3">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Category
                </label>
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  value={formData.category}
                  className="shadow-sm"
                >
                  <option value="uncategorized">Select a category</option>
                  <option value="programming">Programming</option>
                  <option value="travel">Travel</option>
                  <option value="finance">Finance</option>
                </Select>
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Content
              </label>
              {/* Added a wrapper to control Quill's borders and rounded corners */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 transition-colors">
                <ReactQuill
                  theme="snow"
                  placeholder="Write something amazing..."
                  className="h-72 dark:text-white"
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  value={formData.content}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-12 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-lg"
            >
              Update Article
            </button>

            {errMsg && (
              <Alert color="failure" className="mt-4 rounded-xl">
                {errMsg}
              </Alert>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
