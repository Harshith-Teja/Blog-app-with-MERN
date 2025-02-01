import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  deleteUserFailure,
  deleteUserSuccess,
  signoutFailure,
  signoutStart,
  signoutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api/requestUrl";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const DashProfile = () => {
  const {
    currentUser,
    error: errMsg,
    loading,
  } = useSelector((state: RootState) => state.user);
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

  const [showModal, setShowModal] = useState(false);

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

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());

      const response = await axios.post(`${BASE_URL}/logout`, {
        withCredentials: true,
      });

      const data = response?.data;

      if (data.success === false) {
        dispatch(signoutFailure(data.message));
        return;
      }

      dispatch(signoutSuccess());
    } catch (err: any) {
      dispatch(signoutFailure(err.message));
    }
  };
  const handleDelete = async () => {
    setShowModal(false);

    try {
      dispatch(updateStart());

      const response = await axios.delete(
        `${BASE_URL}/users/delete/${currentUser?._id}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
      }

      dispatch(deleteUserSuccess(data.message));
    } catch (err: any) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      const response = await axios.put(
        `${BASE_URL}/users/update/${currentUser?._id}`,
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

      dispatch(updateSuccess(data?.userWithoutPwd));
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
            (uname.length > 0 && !validUname) ||
            (pwd.length > 0 && !validPwd) ||
            loading
          }
        >
          {loading ? <Spinner size="sm" /> : "Update profile"}
        </Button>
        <Button
          gradientDuoTone="purpleToBlue"
          disabled={
            (uname.length > 0 && !validUname) ||
            (pwd.length > 0 && !validPwd) ||
            loading
          }
        >
          <Link to="/create-post">Create posts</Link>
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
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete account
        </span>
        <span className="cursor-pointer" onClick={handleSignout}>
          Sign out
        </span>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />
          <Modal.Body className="text-center">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="w-14 h-14 text-gray-500 dark:text-gray-200 mb-4"
            />
            <h1 className="text-gray-500 dark:text-gray-200 text-lg mb-4">
              Are you sure you want to delete your account?
            </h1>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashProfile;
