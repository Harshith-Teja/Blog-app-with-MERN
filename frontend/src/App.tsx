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
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import PostPage from "./components/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./components/Search";

function App() {
  return (
    <div className="w-full min-h-screen">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />

          <Route element={<PrivateRoute />}>
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>

          <Route path="/posts/:slug" element={<PostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
