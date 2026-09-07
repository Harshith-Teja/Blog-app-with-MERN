import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Spinner, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { RootState } from "../redux/store";
import OAuth from "./OAuth";
import { BASE_URL } from "../api/requestUrl";

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

  // Local state to track if the demo login specifically is loading
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  //puts the cursor(focus) on user name on every refresh
  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  useEffect(() => {
    dispatch(signInFailure(""));
  }, [uname, pwd, dispatch]);

  const executeLogin = async (
    usernameToLogin: string,
    passwordToLogin: string
  ) => {
    try {
      setIsDemoLoading(true);
      dispatch(signInStart());
      const response = await axios.post(
        `${BASE_URL}/login`,
        JSON.stringify({ uname: usernameToLogin, pwd: passwordToLogin }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        setIsDemoLoading(false);
        return;
      }

      setUname("");
      setPwd("");
      dispatch(signInSuccess(data));
      setIsDemoLoading(false);
      navigate("/");
    } catch (err: any) {
      if (!err?.response) dispatch(signInFailure("No server response"));
      else if (err.response.status === 409)
        dispatch(signInFailure("Username already taken"));
      else if (err.response.status === 401)
        dispatch(signInFailure("Unauthorized. Check credentials."));
      else dispatch(signInFailure(err.message));

      setIsDemoLoading(false);
      errRef.current?.focus(); //puts the focus on error on error message
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!uname || !pwd) {
      dispatch(signInFailure("Username and password are required to login"));
      if (userRef.current) userRef.current.focus();
      return;
    }

    executeLogin(uname, pwd);
  };

  // 1-Click Demo Login Handler
  const handleDemoLogin = () => {
    // Visually update the inputs for a split second before the redirect
    const demoUserId = import.meta.env.VITE_DEMO_USER_ID;
    const demoUserPwd = import.meta.env.VITE_DEMO_USER_PWD;

    setUname(demoUserId);
    setPwd(demoUserPwd);
    executeLogin(demoUserId, demoUserPwd);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 dark:bg-transparent relative overflow-hidden font-sans pt-16 pb-12 px-4">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-10 md:gap-16 z-10">
        {/* Brand Section */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <Link
            to="/"
            className="hover:scale-105 transition-transform duration-300"
          >
            <h1 className="font-extrabold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
              BlogSmith
            </h1>
          </Link>
          <p className="font-medium text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-md">
            Forge your thoughts into powerful posts. Join our community of
            creators today.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full max-w-md mx-auto">
          <form
            className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl flex flex-col gap-6"
            onSubmit={handleSubmit}
          >
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Welcome back
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Please enter your details to sign in.
              </p>
            </div>

            {/* DEMO BANNER */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 p-4 group">
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
                    👋 Evaluating my project?
                  </p>
                  <p className="text-xs text-indigo-600/80 dark:text-indigo-400 mt-0.5">
                    Skip the setup and explore instantly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="whitespace-nowrap px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-70 min-w-[130px]"
                >
                  {isDemoLoading ? (
                    <>
                      <Spinner size="sm" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faRocket} />
                      1-Click Demo
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Soft reminder about cookies */}
            <p className="text-center text-[12px] text-slate-600 dark:text-slate-500 mt-2">
              Please ensure 3rd-party cookies are enabled to access all
              features.
            </p>

            <Alert
              ref={errRef}
              color="failure"
              className={errMsg ? "block rounded-xl" : "hidden"}
              aria-live="assertive"
            >
              {errMsg}
            </Alert>

            <div>
              <label
                htmlFor="uname"
                className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
              >
                Username
              </label>
              <TextInput
                type="text"
                id="uname"
                autoComplete="off"
                value={uname}
                onChange={(e) => setUname(e.target.value)}
                className="shadow-sm"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="pwd"
                className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <TextInput
                type="password"
                id="pwd"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:transform-none flex justify-center items-center h-12"
            >
              {loading && !isDemoLoading ? <Spinner size="sm" /> : "Sign in"}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">
                or
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            <OAuth />

            <div className="text-center mt-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                New user?{" "}
                <Link
                  to="/register"
                  className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
