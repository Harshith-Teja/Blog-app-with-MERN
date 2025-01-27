import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./DashSidebar";
import DashProfile from "./DashProfile";
import DashPosts from "./DashPosts";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFrmUrl = urlParams.get("tab");

    if (tabFrmUrl) setTab(tabFrmUrl);
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <DashSidebar />
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPosts />}
    </div>
  );
};

export default Dashboard;
