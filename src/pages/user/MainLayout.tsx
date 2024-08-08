import React, { useState } from "react";
import { Box, Modal } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Upload from "../../firebase/configFirebase";
import LeftSider from "./LeftSider";
import { RootState, AppDispatch } from "../../store";
import { IUsers } from "../../interface";
import { createNewPost } from "../../store/slices/postsSlice";

const MainLayout: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    if (userLogin) {
      dispatch(
        createNewPost({
          userId: userLogin.id,
          image: [imageUrl],
          content: "", // Bạn có thể thêm một input để người dùng nhập nội dung
          date: new Date().toISOString(),
          reactions: [],
        })
      );
    }
    setIsModalVisible(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <LeftSider showModal={showModal} userId={userLogin?.id} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: "250px" }}>
        <Outlet />
      </Box>
      <Modal
        open={isModalVisible}
        onClose={handleCancel}
        aria-labelledby="modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2 id="modal-title">Upload Image</h2>
          <Upload
            onClose={handleCancel}
            onImageUpload={handleImageUpload}
            userId={userLogin?.id || 0}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default MainLayout;
