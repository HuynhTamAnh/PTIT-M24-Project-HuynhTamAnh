import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewPosts } from "../store/slices/postsSlice";
import { Layout } from "antd";
import { AppDispatch, RootState } from "../store";
import { IUsers } from "../interface";
import LeftSider from "./user/LeftSider";
import { Outlet } from "react-router-dom";
import { autoLogin } from "../store/slices/usersSlice";
import UploadModal from "./user/UploadModal"; // Điều chỉnh đường dẫn nếu cần

const { Content } = Layout;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;

  useEffect(() => {
    dispatch(getNewPosts());
    const token = localStorage.getItem("accessToken");
    if (token) {
      dispatch(autoLogin());
    } else "/login";
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleImageUpload = (
    imageUrl: string,
    content: string,
    privacy: string
  ) => {
    setUploadedImages((prevImages) => [imageUrl, ...prevImages]);
    // Ở đây, bạn có thể thêm logic để xử lý content và privacy
    // Ví dụ: dispatch một action để lưu bài post mới với đầy đủ thông tin
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#000" }}>
      <LeftSider showModal={showModal} userId={userLogin?.id} />
      <Layout
        style={{ marginLeft: 200, background: "#000", minHeight: "100vh" }}
      >
        <Content>
          <div style={{ padding: 24 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
      <UploadModal
        isVisible={isModalVisible}
        onClose={handleCancel}
        onImageUpload={handleImageUpload}
        userId={userLogin?.id ?? 0}
      />
    </Layout>
  );
};

export default HomePage;
