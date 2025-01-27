import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
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

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFrmUrl = urlParams.get("tab");

    if (tabFrmUrl) setTab(tabFrmUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());

      const response = await axios.post("http://localhost:5000/logout", {
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
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={() => <FontAwesomeIcon icon={faUser} />}
            label={"User"}
            labelColor="dark"
            as="div"
          >
            <Link to="/dashboard?tab=profile">Profile</Link>
          </Sidebar.Item>
          <Sidebar.Item
            icon={() => <FontAwesomeIcon icon={faArrowRight} />}
            className="cursor-pointer"
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
