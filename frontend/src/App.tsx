import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Home from "./components/Home";
import About from "./components/About";
import Dashboard from "./components/Dashboard";
import Blogs from "./components/Blogs";
import Layout from "./components/Layout";
import ErrorPage from "./components/ErrorPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <div className="w-full h-dvh">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blogs" element={<Blogs />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
