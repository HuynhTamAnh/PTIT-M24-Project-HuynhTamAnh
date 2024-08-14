import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  AvatarGroup,
} from "@mui/material";
import { IUsers } from "../../interface";
import { useNavigate } from "react-router-dom";

interface RightSiderProps {
  userLogin: IUsers | null;
}

const RightSider: React.FC<RightSiderProps> = ({ userLogin }) => {
  const navigate = useNavigate();
  const handleProfileClick = () => {
    if (userLogin && userLogin.id) {
      navigate(`/profile/${userLogin.id}`);
    }
  };
  return (
    <>
      <Card sx={{ mb: 2, bgcolor: "background.paper" }}>
        <CardHeader
          onClick={handleProfileClick}
          style={{ cursor: "pointer" }}
          avatar={<Avatar src={userLogin?.avatar} />}
          title={userLogin?.username}
          subheader={userLogin?.email}
        />
      </Card>
      <Card sx={{ mb: 2, bgcolor: "background.paper" }}></Card>
      <Card sx={{ bgcolor: "background.paper" }}></Card>
    </>
  );
};

export default RightSider;
