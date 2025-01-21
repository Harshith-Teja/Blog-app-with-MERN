import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";

const LoginPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { setAuth } = authContext;

  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
      setLoading(true);

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
      setLoading(false);
      navigate("/");
    } catch (err: any) {
      if (!err?.response) setErrMsg("No server response");
      else if (err.response.status === 409) setErrMsg("Username already taken");
      else setErrMsg(err.message);

      errRef.current?.focus();

      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full mt-20 p-3 max-w-3xl mx-auto flex flex-col gap-5 md:flex-row md:items-center">
      <div
        id="logo"
        className="flex-1 flex flex-col justify-center items-center"
      >
        <h1 className="font-bold text-3xl dark:text-white">BlogSmith</h1>
        <p className="font-light text-md dark:text-white">
          Forge your thoughts into powerful posts
        </p>
      </div>
      <div className="flex-1 flex justify-center items-center p-4">
        <form
          className="w-full bg-slate-100 rounded-lg p-8 text-center"
          onSubmit={handleSubmit}
        >
          <Alert
            ref={errRef}
            color="failure"
            className={errMsg ? "block" : "hidden"}
            aria-live="assertive"
          >
            {errMsg}
          </Alert>
          <Label htmlFor="uname" className="text-xl">
            Username
          </Label>
          <br />
          <TextInput
            type="text"
            id="uname"
            autoComplete="off"
            value={uname}
            onChange={(e) => setUname(e.target.value)}
          />
          <br />
          <Label htmlFor="pwd" className="text-xl">
            Password
          </Label>{" "}
          <br />
          <TextInput
            type="password"
            id="pwd"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />{" "}
          <br />
          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : "Sign in"}
          </Button>
          <p>
            New user?{" "}
            <Link to="/register" className="underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
