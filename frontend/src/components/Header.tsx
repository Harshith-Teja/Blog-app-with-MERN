import {
  faMagnifyingGlass,
  faMoon,
  faSun,
  faUser,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { toggleTheme } from "../redux/theme/themeSlice";
import {
  signoutFailure,
  signoutStart,
  signoutSuccess,
} from "../redux/user/userSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../api/requestUrl";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  //changes the searchTerm state when the searchTerm changes in the url
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
  }, [location.search]);

  //logs out user
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
      navigate("/login");
    } catch (err: any) {
      dispatch(signoutFailure(err.message));
    }
  };

  //changes the searchTerm in the url when a new searchTerm is typed through the text input field
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-[rgb(16,23,42)]/80 py-3 shadow-sm transition-all">
      {/* Logo (Left) */}
      <Navbar.Brand as={Link} to="/" className="flex flex-col items-start">
        <span className="self-center whitespace-nowrap text-2xl sm:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
          BlogSmith
        </span>
        <span className="hidden md:block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-0.5 ml-1">
          Forge Your Thoughts
        </span>
      </Navbar.Brand>

      {/* Actions (right) */}
      <div className="flex items-center gap-3 md:order-2">
        <form onSubmit={handleSubmit} className="hidden lg:flex w-56 xl:w-72">
          <TextInput
            type="text"
            placeholder="Search articles..."
            rightIcon={() => (
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="text-cyan-500"
              />
            )}
            className="w-full shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <Button
          className="w-10 h-10 lg:hidden focus:ring-2 focus:ring-cyan-500"
          color="gray"
          pill
          outline
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Button>

        <Button
          className="w-10 h-10 hidden sm:flex items-center justify-center focus:ring-2 focus:ring-cyan-500 transition-transform hover:scale-105"
          color="gray"
          pill
          outline
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FontAwesomeIcon icon={faMoon} className="text-slate-600" />
          ) : (
            <FontAwesomeIcon icon={faSun} className="text-amber-400" />
          )}
        </Button>

        {/* User profile Dropdown */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="p-[2px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 transition-transform hover:scale-105 shadow-md">
                <Avatar
                  alt="user"
                  img={currentUser.profilePic}
                  rounded
                  className="border-2 border-white dark:border-slate-800 rounded-full"
                />
              </div>
            }
          >
            <Dropdown.Header className="px-4 py-3">
              <span className="block text-sm font-bold text-slate-800 dark:text-white truncate">
                {currentUser.uname}
              </span>
              <span className="block text-xs font-medium truncate text-slate-500 dark:text-slate-400 mt-0.5">
                {currentUser.email || "Manage your account"}
              </span>
            </Dropdown.Header>

            <Link to="/dashboard?tab=profile">
              <Dropdown.Item className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <FontAwesomeIcon icon={faUser} className="text-cyan-500" />
                Profile Settings
              </Dropdown.Item>
            </Link>

            <Dropdown.Divider className="my-1 border-slate-100 dark:border-slate-700/50" />

            <Dropdown.Item
              onClick={handleSignout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Button
            gradientDuoTone="cyanToBlue"
            outline
            className="font-semibold transition-transform hover:-translate-y-0.5 shadow-sm"
          >
            <Link to="/login">Sign In</Link>
          </Button>
        )}

        <Navbar.Toggle className="focus:ring-cyan-500" />
      </div>

      {/* Navigation Links */}
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link
            to="/"
            className={`block text-base font-medium transition-colors duration-200 ${
              path === "/"
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            }`}
          >
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link
            to="/about"
            className={`block text-base font-medium transition-colors duration-200 ${
              path === "/about"
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            }`}
          >
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/blogs"} as={"div"}>
          <Link
            to="/blogs"
            className={`block text-base font-medium transition-colors duration-200 ${
              path === "/blogs"
                ? "text-cyan-600 dark:text-cyan-400"
                : "text-slate-600 hover:text-cyan-500 dark:text-slate-300 dark:hover:text-cyan-400"
            }`}
          >
            Blogs
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
