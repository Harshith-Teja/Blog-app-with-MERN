import { faMagnifyingGlass, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const path = useLocation().pathname;

  return (
    <Navbar className="border-b-2">
      <div id="logo" className="flex flex-col">
        <h1 className="font-bold text-sm sm:text-xl md:text-3xl dark:text-white">
          BlogSmith
        </h1>
        <p className="font-light text-sm hidden md:block dark:text-white">
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
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FontAwesomeIcon icon={faMoon} />
        </Button>
        <Button color="cyan">
          <Link to="/login">Sign In</Link>
        </Button>
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
