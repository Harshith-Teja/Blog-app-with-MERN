import {
  faArrowRight,
  faChartSimple,
  faComment,
  faFile,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  signoutFailure,
  signoutStart,
  signoutSuccess,
} from "../redux/user/userSlice";
import axios from "axios";
import { BASE_URL } from "../api/requestUrl";

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");

  //changes the tab state when the tab changes in the url
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFrmUrl = urlParams.get("tab");

    if (tabFrmUrl) setTab(tabFrmUrl);
  }, [location.search]);

  //logs out the current user
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

  return (
    <Sidebar className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2 font-medium">
          <Sidebar.Item
            active={tab === "dash" || !tab}
            icon={() => (
              <FontAwesomeIcon
                icon={faChartSimple}
                className={
                  tab === "dash" || !tab ? "text-cyan-500" : "text-slate-400"
                }
              />
            )}
            as="div"
            className={`rounded-xl transition-all ${
              tab === "dash" || !tab
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Link to="/dashboard?tab=dash" className="block w-full">
              Dashboard
            </Link>
          </Sidebar.Item>

          <Sidebar.Item
            active={tab === "profile"}
            icon={() => (
              <FontAwesomeIcon
                icon={faUser}
                className={
                  tab === "profile" ? "text-cyan-500" : "text-slate-400"
                }
              />
            )}
            as="div"
            className={`rounded-xl transition-all ${
              tab === "profile"
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Link to="/dashboard?tab=profile" className="block w-full">
              Profile
            </Link>
          </Sidebar.Item>

          <Sidebar.Item
            active={tab === "posts"}
            icon={() => (
              <FontAwesomeIcon
                icon={faFile}
                className={tab === "posts" ? "text-cyan-500" : "text-slate-400"}
              />
            )}
            as="div"
            className={`rounded-xl transition-all ${
              tab === "posts"
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Link to="/dashboard?tab=posts" className="block w-full">
              Posts
            </Link>
          </Sidebar.Item>

          <Sidebar.Item
            active={tab === "comments"}
            icon={() => (
              <FontAwesomeIcon
                icon={faComment}
                className={
                  tab === "comments" ? "text-cyan-500" : "text-slate-400"
                }
              />
            )}
            as="div"
            className={`rounded-xl transition-all ${
              tab === "comments"
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Link to="/dashboard?tab=comments" className="block w-full">
              Comments
            </Link>
          </Sidebar.Item>

          <hr className="my-2 border-slate-200 dark:border-slate-800" />

          <Sidebar.Item
            icon={() => (
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-slate-400 group-hover:text-red-500 transition-colors"
              />
            )}
            className="cursor-pointer rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all group"
            onClick={handleSignout}
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
