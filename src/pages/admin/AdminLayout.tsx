import React from "react";
import { Layout, Menu } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { logout } from "../../store/slices/usersSlice";

const { Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />}>
            <Link to="/admin/posts">Posts</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<TeamOutlined />}>
            <Link to="/admin/groups">Groups</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<LogoutSharpIcon />} onClick={handleLogout}>
            Log Out
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
