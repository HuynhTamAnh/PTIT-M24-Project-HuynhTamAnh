import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/usersSlice";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Explore as ExploreIcon,
  Favorite as FavoriteIcon,
  AddCircle as AddCircleIcon,
  Person as PersonIcon,
  ExitToApp as ExitToAppIcon,
  Group,
} from "@mui/icons-material";

interface LeftSiderProps {
  showModal: () => void;
  userId: string | number | undefined;
}

const LeftSider: React.FC<LeftSiderProps> = ({ showModal, userId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { key: "/", icon: <HomeIcon />, text: "Home" },
    { key: "/search", icon: <SearchIcon />, text: "Search" },
    // { key: "/friend", icon: <Group />, text: "Friend" },
    { key: "/notifications", icon: <FavoriteIcon />, text: "Notifications" },
    { key: "create", icon: <AddCircleIcon />, text: "Create" },
    { key: `/profile/${userId}`, icon: <PersonIcon />, text: "Profile" },
    { key: "logout", icon: <ExitToAppIcon />, text: "Logout" },
  ];

  const handleItemClick = (key: string) => {
    setActiveItem(key);
    if (key === "create") {
      showModal();
    } else if (key === "logout") {
      handleLogout();
    } else {
      navigate(key);
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <Typography variant="h6" sx={{ my: 2, textAlign: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
            Shinstagram
          </Link>
        </Typography>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.key}
              onClick={() => handleItemClick(item.key)}
              selected={activeItem === item.key}
            >
              <ListItemIcon
                sx={{
                  color: activeItem === item.key ? "primary.main" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default LeftSider;
