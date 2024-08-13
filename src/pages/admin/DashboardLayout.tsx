// src/components/DashboardLayout.tsx
import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { logout } from "../../store/slices/usersSlice"; // Đảm bảo đường dẫn này chính xác

const { Sider, Content } = Layout;

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark">
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["users"]}>
          <Menu.Item key="users" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="posts" icon={<FileTextOutlined />}>
            <Link to="/admin/posts">Posts</Link>
          </Menu.Item>
          <Menu.Item key="groups" icon={<TeamOutlined />}>
            <Link to="/admin/groups">Groups</Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutSharpIcon />}
            onClick={handleLogout}
          >
            Log Out
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "24px 16px 0" }}>
          <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
