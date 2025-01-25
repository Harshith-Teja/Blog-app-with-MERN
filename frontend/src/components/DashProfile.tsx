import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import axios from "axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const DashProfile = () => {
  const { currentUser, error: errMsg } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  const [uname, setUname] = useState(currentUser?.uname || "");
  const [validUname, setValidUname] = useState(false);
  const [unameFocus, setUnameFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    dispatch(updateFailure(""));
    setSuccess(false);
    setValidUname(USER_REGEX.test(uname));
  }, [uname]);

  useEffect(() => {
    dispatch(updateFailure(""));
    setSuccess(false);
    setValidPwd(PWD_REGEX.test(pwd));
  }, [pwd]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      const response = await axios.put(
        `http://localhost:5000/users/update/${currentUser?._id}`,
        JSON.stringify({ uname, pwd }),
        {
          headers: { "Content-Type": "Application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }

      console.log(data);

      dispatch(updateSuccess(data.userWithoutPwd));
      setSuccess(true);
      successRef.current?.focus();
    } catch (err: any) {
      if (!err?.response) dispatch(updateFailure("No server response"));
      else if (err.response?.status === 409)
        dispatch(updateFailure("Username already taken"));
      else dispatch(updateFailure(err.message));

      errRef.current?.focus();
    }
  };
  return (
    <div className="max-w-lg w-full mx-auto p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
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
              ? "text-xs p-1 rounded-md bg-slate-400 w-5/6 mx-auto"
              : "hidden"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} /> 4 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>
        <TextInput
          type="password"
          id="pwd"
          placeholder="Password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          aria-invalid={!validPwd ? "true" : "false"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p
          id="pwdnote"
          className={
            pwdFocus && pwd && !validPwd
              ? "text-xs p-1 rounded-md bg-slate-400 w-5/6 mx-auto"
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
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          disabled={
            (uname.length > 0 && !validUname) || (pwd.length > 0 && !validPwd)
          }
        >
          Update
        </Button>
        <Alert
          ref={errRef}
          color="failure"
          className={errMsg ? "block" : "hidden"}
          aria-live="assertive"
        >
          {errMsg}
        </Alert>
        <Alert
          ref={successRef}
          color="success"
          className={success ? "block" : "hidden"}
          aria-live="assertive"
        >
          Profile updated successfully
        </Alert>
      </form>
      <div className="text-red-500 mt-5 flex justify-between">
        <span className="cursor-pointer">Delete account</span>
        <span className="cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default DashProfile;
