import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { RootState } from "../redux/store";
import OAuth from "./OAuth";

const LoginPage = () => {
  const dispatch = useDispatch();

  const [uname, setUname] = useState("");
  const [pwd, setPwd] = useState("");

  const { loading, error: errMsg } = useSelector(
    (state: RootState) => state.user
  );

  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    dispatch(signInFailure(""));
  }, [uname, pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!uname || !pwd) {
      dispatch(signInFailure("Username and password are required to login"));

      if (userRef.current) userRef.current.focus();

      return;
    }

    try {
      dispatch(signInStart());

      const response = await axios.post(
        "http://localhost:5000/login",
        JSON.stringify({ uname, pwd }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      console.log(data);

      setUname("");
      setPwd("");
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err: any) {
      if (!err?.response) dispatch(signInFailure("No server response"));
      else if (err.response.status === 409)
        dispatch(signInFailure("Username already taken"));
      else dispatch(signInFailure(err.message));

      errRef.current?.focus();
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
          <OAuth />
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
