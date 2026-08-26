import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Alert, Modal, Spinner, TextInput } from "flowbite-react";
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

  //logs out the user
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

  //deletes the user
  const handleDelete = async () => {
    setShowModal(false);

    try {
      dispatch(updateStart());

      const response = await axios.delete(
        `${BASE_URL}/users/delete/${currentUser?._id}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
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

  //updates the user info
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      const response = await axios.put(
        `${BASE_URL}/users/update/${currentUser?._id}`,
        JSON.stringify({ uname, pwd }),
        {
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${currentUser?.accessToken}`,
          },
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
    <div className="max-w-lg w-full mx-auto p-6 md:p-8 font-sans min-h-screen">
      <h1 className="mb-8 text-center font-extrabold text-3xl text-slate-800 dark:text-white tracking-tight">
        Profile Settings
      </h1>

      <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800/60 rounded-[2rem] shadow-sm p-6 md:p-8">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Ambient Glow Profile Picture */}
          <div className="relative w-32 h-32 mx-auto mb-4 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full blur-[12px] opacity-60 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            <img
              src={currentUser?.profilePic}
              alt="profilePic"
              className="relative w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md"
            />
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
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
                className="shadow-sm"
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
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <TextInput
                type="password"
                id="pwd"
                placeholder="Leave blank to keep current password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                aria-invalid={!validPwd ? "true" : "false"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                className="shadow-sm"
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
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number, and a
                  special character.
                  <br />
                  Allowed: <span className="font-mono">! @ # $ %</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              disabled={
                (uname.length > 0 && !validUname) ||
                (pwd.length > 0 && !validPwd) ||
                loading
              }
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-11"
            >
              {loading ? <Spinner size="sm" /> : "Update Profile"}
            </button>

            <Link to="/create-post" className="w-full">
              <button
                type="button"
                className="w-full py-2.5 bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 font-bold rounded-xl border border-cyan-500/30 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all duration-200 shadow-sm flex justify-center items-center h-11"
              >
                Create New Post
              </button>
            </Link>
          </div>

          <Alert
            ref={errRef}
            color="failure"
            className={errMsg ? "block rounded-xl" : "hidden"}
            aria-live="assertive"
          >
            {errMsg}
          </Alert>
          <Alert
            ref={successRef}
            color="success"
            className={success ? "block rounded-xl" : "hidden"}
            aria-live="assertive"
          >
            Profile updated successfully
          </Alert>
        </form>

        {/* Destructive Actions */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
          <button
            type="button"
            className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors duration-200 outline-none"
            onClick={() => setShowModal(true)}
          >
            Delete account
          </button>
          <button
            type="button"
            className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors duration-200 outline-none"
            onClick={handleSignout}
          >
            Sign out
          </button>
        </div>
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
              className="w-14 h-14 text-slate-400 dark:text-slate-200 mb-4"
            />
            <h1 className="text-slate-600 dark:text-slate-200 text-lg font-medium mb-6">
              Are you sure you want to delete your account?
            </h1>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full shadow-sm transition-colors"
                onClick={handleDelete}
              >
                Yes, I'm sure
              </button>
              <button
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-full transition-colors"
                onClick={() => setShowModal(false)}
              >
                No, cancel
              </button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashProfile;
