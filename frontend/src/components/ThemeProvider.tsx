import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useSelector((state: RootState) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-black dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
