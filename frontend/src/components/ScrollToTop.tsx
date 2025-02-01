import { useEffect } from "react";
import { useLocation } from "react-router-dom";

//whenever user is redirected to a page, the user is always re-directed to the top of the page. (This is wrapped around around all pages(in main file))
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
