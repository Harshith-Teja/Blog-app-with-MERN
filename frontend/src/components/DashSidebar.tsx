import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFrmUrl = urlParams.get("tab");

    if (tabFrmUrl) setTab(tabFrmUrl);
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            active={tab === "profile"}
            icon={() => <FontAwesomeIcon icon={faUser} />}
            label={"User"}
            labelColor="dark"
          >
            <Link to="/dashboard?tab=profile">Profile</Link>
          </Sidebar.Item>
          <Sidebar.Item
            icon={() => <FontAwesomeIcon icon={faArrowRight} />}
            classname="cursor-pointer"
          >
            Sign out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
