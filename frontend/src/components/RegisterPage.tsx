import {
  faCheck,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setValidUname(USER_REGEX.test(uname));
  }, [uname]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidCnfrmPwd(pwd === cnfrmPwd);
  }, [pwd, cnfrmPwd]);

  return (
    <div className="w-full h-full flex justify-center items-center bg-cyan-400">
      <form className="w-[30%] bg-slate-100 rounded-lg p-8 text-center">
        <h1 className="font-bold text-3xl mb-4">Register Page</h1>
        <label htmlFor="uname" className="text-xl">
          Username{" "}
          {/* Correctness of uname will be evaluated only when uname is entered */}
          {uname &&
            (validUname ? (
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
            ) : (
              <FontAwesomeIcon icon={faXmark} className="text-red-600" />
            ))}
        </label>
        <br />
        <input
          type="text"
          id="uname"
          className="border-black border-2 rounded-md p-1 mb-4 w-2/3"
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
              ? "text-xs p-1 rounded-md bg-slate-400 w-2/3 mx-auto"
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
        <label htmlFor="pwd" className="text-xl">
          Password{" "}
          {/* Correctness of pwd will be evaluated only when pwd is entered */}
          {pwd &&
            (validPwd ? (
              <FontAwesomeIcon icon={faCheck} className="text-green-500" />
            ) : (
              <FontAwesomeIcon icon={faXmark} className="text-red-600" />
            ))}
        </label>
        <br />
        <input
          type="password"
          id="pwd"
          className="border-black border-2 rounded-md p-1 mb-4 w-2/3"
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
              ? "text-xs p-1 rounded-md bg-slate-400 w-2/3 mx-auto"
              : "hidden"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
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
        </label>{" "}
        <br />
        <input
          type="password"
          id="cnfrmPwd"
          className="border-black border-2 rounded-md p-1 mb-4 w-2/3"
          onChange={(e) => setCnfrmPwd(e.target.value)}
          aria-invalid={!validCnfrmPwd ? "true" : "false"}
          aria-describedby="cnfrmnote"
          onFocus={() => setCnfrmPwdFocus(true)}
          onBlur={() => setCnfrmPwdFocus(false)}
        />{" "}
        <br />
        <p
          id="cnfrmnote"
          className={
            cnfrmPwdFocus && cnfrmPwd && !validCnfrmPwd
              ? "text-xs p-1 rounded-md bg-slate-400 w-2/3 mx-auto"
              : "hidden"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input field.
        </p>
        <button
          className="p-2 w-1/2 rounded-md bg-cyan-300 my-4"
          disabled={!validUname || !validPwd || !validCnfrmPwd}
        >
          Submit
        </button>
        <p>
          Already a user?{" "}
          <Link to="/login" className="underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
