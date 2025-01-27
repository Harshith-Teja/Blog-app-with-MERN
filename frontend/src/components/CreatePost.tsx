import { Button, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl font-bold my-7">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            id="title"
            placeholder="Title"
            className="flex-1"
            required
          />
          <Select>
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
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
