import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Button, TextInput } from "flowbite-react";

const DashProfile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className="max-w-lg w-full mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 w-full">
        <div className="w-32 h-32 rounded-full object-cover p-1 bg-gradient-to-r from-blue-500 to-purple-500 self-center">
          <img
            src={currentUser?.profilePic}
            alt="profilePic"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="uname"
          placeholder="Username"
          defaultValue={currentUser?.uname}
        />
        <TextInput type="password" id="pwd" placeholder="Password" />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
      </form>
      <div className="text-red-500 mt-5 flex justify-between">
        <span className="cursor-pointer">Delete account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default DashProfile;
