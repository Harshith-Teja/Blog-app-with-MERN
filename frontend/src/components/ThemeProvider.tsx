import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

//applies regular and dark theme colors to all pages (This is wrapped around all pages in main file)
const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useSelector((state: RootState) => state.theme);

  // Sync the theme with the HTML root so the browser scrollbar and background adapt
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className={theme}>
      <div className="bg-white text-black dark:text-gray-200 dark:bg-gray-950 min-h-screen transition-colors duration-300">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
