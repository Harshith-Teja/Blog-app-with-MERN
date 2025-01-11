import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";

const LoginPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setAuth } = authContext;

  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [uname, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!uname || !pwd) {
      setErrMsg("Username and password are required to login");

      if (userRef.current) userRef.current.focus();

      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        JSON.stringify({ uname, pwd }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      console.log(response.data);
      console.log(JSON.stringify(response));

      const accessToken: string | null = response?.data?.accessToken;
      setAuth({ uname, pwd, accessToken });
      setUname("");
      setPwd("");
      setSuccess(true);
    } catch (err: any) {
      if (!err?.response) setErrMsg("No server response");
      else setErrMsg(err.message);

      errRef.current?.focus();
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center bg-cyan-400">
      {success ? (
        <section className="w-[30%] bg-slate-100 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-green-500">Success!!</h1>
          <Link to="/" className="underline">
            Go to home
          </Link>
        </section>
      ) : (
        <form
          className="w-[30%] bg-slate-100 rounded-lg p-8 text-center"
          onSubmit={handleSubmit}
        >
          <p ref={errRef} className="text-red-500" aria-live="assertive">
            {errMsg}
          </p>
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
      )}
    </div>
  );
};

export default LoginPage;
