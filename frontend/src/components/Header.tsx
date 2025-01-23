import {
  faMagnifyingGlass,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { RootState } from "../redux/store";
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {
  const path = useLocation().pathname;
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { theme } = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  return (
    <Navbar className="border-b-2">
      <div id="logo" className="flex flex-col">
        <h1 className="font-bold text-sm sm:text-xl md:text-3xl">BlogSmith</h1>
        <p className="font-light text-sm hidden md:block">
          Forge your thoughts into powerful posts
        </p>
      </div>
      <form>
        <TextInput
          type="text"
          placeholder="Search a post"
          rightIcon={() => <FontAwesomeIcon icon={faMagnifyingGlass} />} //rightIcon expects a react component to render, so the fa icon is wrapped in a react component and passed as a whole
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? (
            <FontAwesomeIcon icon={faMoon} />
          ) : (
            <FontAwesomeIcon icon={faSun} />
          )}
        </Button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="user" img={currentUser.profilePic} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentUser.uname}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button gradientDuoTone="purpleToBlue" outline>
            <Link to="/login">Sign In</Link>
          </Button>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/blogs"} as={"div"}>
          <Link to="/blogs">Blogs</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
