import {
  faCheck,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Alert, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "./OAuth";
import { BASE_URL } from "../api/requestUrl";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RegisterPage = () => {
  const [uname, setUname] = useState("");
  const [validUname, setValidUname] = useState(false);
  const [unameFocus, setUnameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [cnfrmPwd, setCnfrmPwd] = useState("");
  const [validCnfrmPwd, setValidCnfrmPwd] = useState(false);
  const [cnfrmPwdFocus, setCnfrmPwdFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValidUname(USER_REGEX.test(uname));
  }, [uname]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidCnfrmPwd(pwd === cnfrmPwd && pwd !== "");
  }, [pwd, cnfrmPwd]);

  //puts the cursor(focus) on user name on every refresh
  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //if button is enabled by JS hack
    if (!uname || !pwd) {
      setErrMsg("Username and password are required to submit");
      if (errRef.current) errRef.current.focus();
      return;
    }

    const v1 = USER_REGEX.test(uname);
    const v2 = PWD_REGEX.test(pwd);

    if (!v1 || !v2) {
      setErrMsg("Invalid username or password");
      if (errRef.current) errRef.current.focus();
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/register`, JSON.stringify({ uname, pwd }), {
        headers: { "Content-Type": "application/json" },
      });

      setUname("");
      setPwd("");
      setCnfrmPwd("");
      setErrMsg("");
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      if (!err?.response) setErrMsg("No server response");
      else if (err.response.status === 409) setErrMsg("Username already taken");
      else setErrMsg(err.message);

      if (errRef.current) errRef.current.focus(); //puts the cursor(focus) on error when error occurs

      setLoading(false);
    }
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
            Start your journey. Create an account to forge your thoughts into
            powerful posts.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex-1 w-full max-w-md mx-auto">
          {success ? (
            <div className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-10 shadow-2xl text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-4xl text-green-500"
                />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-4">
                Success!
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Your account has been created successfully.
              </p>
              <Link to="/login">
                <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                  Proceed to Login
                </button>
              </Link>
            </div>
          ) : (
            <form
              className="w-full bg-white dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[2rem] p-8 sm:p-10 shadow-2xl flex flex-col gap-5"
              onSubmit={handleSubmit}
            >
              <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  Create an account
                </h2>
              </div>

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
                  className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
                >
                  Username
                  {uname && (
                    <FontAwesomeIcon
                      icon={validUname ? faCheck : faXmark}
                      className={
                        validUname
                          ? "text-green-500 text-sm"
                          : "text-red-500 text-sm"
                      }
                    />
                  )}
                </label>
                <TextInput
                  type="text"
                  id="uname"
                  ref={userRef}
                  value={uname}
                  onChange={(e) => setUname(e.target.value)}
                  aria-invalid={!validUname ? "true" : "false"}
                  aria-describedby="uidnote"
                  onFocus={() => setUnameFocus(true)}
                  onBlur={() => setUnameFocus(false)}
                  className="shadow-sm"
                  placeholder="Choose a username"
                />
                <div
                  id="uidnote"
                  className={
                    unameFocus && uname && !validUname
                      ? "mt-2 flex items-start gap-2 text-xs p-3 rounded-xl bg-blue-50 text-gray-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 transition-all"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                  <p>
                    4-24 characters. Must begin with a letter. Letters, numbers,
                    hyphens allowed.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="pwd"
                  className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
                >
                  Password
                  {pwd && (
                    <FontAwesomeIcon
                      icon={validPwd ? faCheck : faXmark}
                      className={
                        validPwd
                          ? "text-green-500 text-sm"
                          : "text-red-500 text-sm"
                      }
                    />
                  )}
                </label>
                <TextInput
                  type="password"
                  id="pwd"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  aria-invalid={!validPwd ? "true" : "false"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  className="shadow-sm"
                  placeholder="Create a strong password"
                />
                <div
                  id="pwdnote"
                  className={
                    pwdFocus && pwd && !validPwd
                      ? "mt-2 flex items-start gap-2 text-xs p-3 rounded-xl bg-blue-50 text-gray-700 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50 transition-all"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                  <p>
                    8-24 characters. Must include upper/lowercase, a number, and
                    a special character (!@#$%).
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cnfrmPwd"
                  className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2"
                >
                  Confirm Password
                  {cnfrmPwd && (
                    <FontAwesomeIcon
                      icon={validCnfrmPwd ? faCheck : faXmark}
                      className={
                        validCnfrmPwd
                          ? "text-green-500 text-sm"
                          : "text-red-500 text-sm"
                      }
                    />
                  )}
                </label>
                <TextInput
                  type="password"
                  id="cnfrmPwd"
                  value={cnfrmPwd}
                  onChange={(e) => setCnfrmPwd(e.target.value)}
                  aria-invalid={!validCnfrmPwd ? "true" : "false"}
                  aria-describedby="cnfrmnote"
                  onFocus={() => setCnfrmPwdFocus(true)}
                  onBlur={() => setCnfrmPwdFocus(false)}
                  className="shadow-sm"
                  placeholder="Confirm your password"
                />
                <div
                  id="cnfrmnote"
                  className={
                    cnfrmPwdFocus && cnfrmPwd && !validCnfrmPwd
                      ? "mt-2 flex items-start gap-2 text-xs p-3 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-800/50 transition-all"
                      : "hidden"
                  }
                >
                  <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
                  <p>Must match with the first password input field.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={!validUname || !validPwd || !validCnfrmPwd || loading}
                className="mt-2 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-12"
              >
                {loading ? <Spinner size="sm" /> : "Sign up"}
              </button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">
                  or
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <OAuth />

              <div className="text-center mt-2">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Already a user?{" "}
                  <Link
                    to="/login"
                    className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
