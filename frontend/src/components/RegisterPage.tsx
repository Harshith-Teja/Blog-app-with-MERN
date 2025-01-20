import {
  faCheck,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { Button, Label, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

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

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setValidUname(USER_REGEX.test(uname));
  }, [uname]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidCnfrmPwd(pwd === cnfrmPwd);
  }, [pwd, cnfrmPwd]);

  useEffect(() => {
    if (userRef.current) userRef.current.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //if button is enabled by JS hack
    if (!uname || !pwd) {
      setErrMsg("Username and pwd are required to submit");
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
      const response = await axios.post(
        "http://localhost:5000/register",
        JSON.stringify({ uname, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(response?.data);
      console.log(JSON.stringify(response));
      setUname("");
      setPwd("");
      setCnfrmPwd("");
      setErrMsg("");
      setSuccess(true);
    } catch (err: any) {
      if (!err?.response) setErrMsg("No server response");
      else if (err.response.status === 409) setErrMsg("Username already taken");
      else setErrMsg(err.message);

      if (errRef.current) errRef.current.focus();
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
        {success ? (
          <section className="w-[30%] bg-slate-100 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-semibold text-green-500">Success!!</h1>
            <Link to="/login" className="underline">
              Sign In
            </Link>
          </section>
        ) : (
          <form
            className="w-full bg-slate-100 rounded-lg p-8 text-center"
            onSubmit={handleSubmit}
          >
            <p ref={errRef} className="text-red-500" aria-live="assertive">
              {errMsg}
            </p>
            <h1 className="font-bold text-3xl mb-4">Sign up</h1>
            <Label htmlFor="uname" className="text-xl">
              Username{" "}
              {/* Correctness of uname will be evaluated only when uname is entered */}
              {uname &&
                (validUname ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                ))}
            </Label>
            <br />
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
            />
            <p
              id="uidnote"
              className={
                unameFocus && uname && !validUname
                  ? "text-xs p-1 mt-2 rounded-md bg-slate-400 w-5/6 mx-auto"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <br />
            <Label htmlFor="pwd" className="text-xl">
              Password{" "}
              {/* Correctness of pwd will be evaluated only when pwd is entered */}
              {pwd &&
                (validPwd ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                ))}
            </Label>
            <br />
            <TextInput
              type="password"
              id="pwd"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              aria-invalid={!validPwd ? "true" : "false"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={
                pwdFocus && pwd && !validPwd
                  ? "text-xs p-1 mt-2 rounded-md bg-slate-400 w-5/6 mx-auto"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <br />
            <label htmlFor="cnfrmPwd" className="text-xl">
              Confirm Password{" "}
              {/* Correctness of cnfrm pwd will be evaluated only when cnfrm pwd is entered */}
              {cnfrmPwd &&
                (validCnfrmPwd ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                ) : (
                  <FontAwesomeIcon icon={faXmark} className="text-red-600" />
                ))}
            </label>
            <br />
            <TextInput
              type="password"
              id="cnfrmPwd"
              value={cnfrmPwd}
              onChange={(e) => setCnfrmPwd(e.target.value)}
              aria-invalid={!validCnfrmPwd ? "true" : "false"}
              aria-describedby="cnfrmnote"
              onFocus={() => setCnfrmPwdFocus(true)}
              onBlur={() => setCnfrmPwdFocus(false)}
            />
            <p
              id="cnfrmnote"
              className={
                cnfrmPwdFocus && cnfrmPwd && !validCnfrmPwd
                  ? "text-xs p-1 mt-2 rounded-md bg-slate-400 w-5/6 mx-auto"
                  : "hidden"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              className="w-full mt-4"
              disabled={!validUname || !validPwd || !validCnfrmPwd}
            >
              Sign up
            </Button>
            <p>
              Already a user?{" "}
              <Link to="/login" className="underline">
                Login here
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
