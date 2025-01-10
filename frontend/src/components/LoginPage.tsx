import { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  return (
    <div className="w-full h-full flex justify-center items-center bg-cyan-400">
      <form className="w-[30%] bg-slate-100 rounded-lg p-8 text-center">
        <h1 className="font-bold text-3xl mb-4">Login Page</h1>
        <label htmlFor="uname" className="text-xl">
          Username
        </label>
        <br />
        <input
          type="text"
          id="uname"
          className="border-black border-2 rounded-md p-1 mb-4 w-2/3"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
        />
        <br />
        <label htmlFor="pwd" className="text-xl">
          Password
        </label>{" "}
        <br />
        <input
          type="password"
          id="pwd"
          className="border-black border-2 rounded-md p-1 mb-4 w-2/3"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />{" "}
        <br />
        <button className="p-2 w-1/2 rounded-md bg-cyan-300 my-2">
          Submit
        </button>
        <p>
          New user?{" "}
          <Link to="/register" className="underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
