import { Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages";
import Profile from "../pages/user/Profile";
import HomeContent from "../pages/user/HomeContent";
import DashboardLayout from "../pages/admin/DashboardLayout";
import Users from "../pages/admin/Users";
import Posts from "../pages/admin/Posts";
import Groups from "../pages/admin/Groups";

const Router = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="users" element={<Users />} />
        <Route path="posts" element={<Posts />} />
        <Route path="groups" element={<Groups />} />
      </Route>

      <Route path="/" element={<HomePage />}>
        <Route index element={<HomeContent />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Route>

      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
  );
};

export default Router;
