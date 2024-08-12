// Profile.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Box,
  Grid,
  Container,
  Badge,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { AppDispatch, RootState } from "../../store";
import { IUsers, IPosts } from "../../interface";

import {
  logout,
  updateUserProfile,
  fetchUserProfile,
  fetchUserFriends,
} from "../../store/slices/usersSlice";
import { fetchUserPosts } from "../../store/slices/postsSlice";
import EditProfileModal from "./EditProfileModal";
import PostModal from "./PostModal";
import FollowersList from "../user/FollowerList";
import { getAllUsers } from "../../store/slices/friendsSlice";
import AvatarUploadModal from "./AvatarUploadModal";
import FullPostModal from "./PostModal";
const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedPost, setSelectedPost] = useState<IPosts | null>(null);
  const [isFollowersListOpen, setIsFollowersListOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  // const [selectedPost, setSelectedPost] = useState<IPosts | null>(null);

  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;
  const profileUser = useSelector(
    (state: RootState) => state.usersSlice.profileUser
  ) as IUsers | null;
  const userPosts = useSelector(
    (state: RootState) => state.postsSlice.userPosts
  ) as IPosts[];
  const currentProfileFriends = useSelector(
    (state: RootState) => state.usersSlice.currentProfileFriends
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
      dispatch(fetchUserPosts(userId));
      dispatch(fetchUserFriends(parseInt(userId)));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (updatedProfile: Partial<IUsers>) => {
    if (userLogin) {
      try {
        await dispatch(
          updateUserProfile({ id: userLogin.id, ...updatedProfile })
        );
        if (userId) {
          dispatch(fetchUserProfile(userId));
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
      }
    }
    setIsEditModalOpen(false);
  };

  const isOwnProfile = userLogin?.id === profileUser?.id;

  const handlePostClick = (post: IPosts) => {
    setSelectedPost(post);
  };

  const handleClosePostModal = () => {
    setSelectedPost(null);
  };

  const handleFollowersClick = () => {
    setIsFollowersListOpen(true);
  };

  const handleCloseFollowersList = () => {
    setIsFollowersListOpen(false);
  };

  // console.log(userLogin);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fff", color: "#000" }}>
      <Container sx={{ mt: 8 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} textAlign="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                cursor: isOwnProfile ? "pointer" : "default",
              }}
              src={profileUser?.avatar}
              onClick={() => {
                if (isOwnProfile) {
                  setIsAvatarModalOpen(true);
                }
              }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              {profileUser?.username}
            </Typography>
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {profileUser?.username}
              </Typography>
              {isOwnProfile && (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      mx: 1,
                      backgroundColor: "#333",
                      padding: "5px 10px",
                      fontSize: "0.875rem",
                    }}
                    startIcon={<SettingsIcon />}
                    onClick={handleEditProfile}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      mx: 1,
                      backgroundColor: "#333",
                      padding: "5px 10px",
                      fontSize: "0.875rem",
                    }}
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </>
              )}
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body1">
                  <Badge badgeContent={userPosts.length} color="primary">
                    Bài viết
                  </Badge>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  <Badge
                    badgeContent={profileUser?.friends?.length || 0}
                    color="primary"
                    onClick={handleFollowersClick}
                    sx={{ cursor: "pointer" }}
                  >
                    Bạn bè
                  </Badge>
                </Typography>
              </Grid>
              <Grid item></Grid>
            </Grid>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{ mt: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Bài viết" />
              <Tab label="Đã lưu" />
              <Tab label="Được gắn thẻ" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {userPosts.map((post) => (
                  <Grid item xs={12} sm={6} md={4} key={post.id}>
                    <Box
                      sx={{
                        position: "relative",
                        paddingTop: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      onClick={() => handlePostClick(post)}
                    >
                      <img
                        src={post.image[0]}
                        alt={post.content}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      {post.image.length > 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            color: "white",
                            borderRadius: "4px",
                            padding: "2px 6px",
                            fontSize: "0.75rem",
                          }}
                        >
                          <Typography variant="caption">
                            {post.image.length}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Typography>Chưa có bài viết đã lưu.</Typography>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography>Chưa có bài viết được gắn thẻ.</Typography>
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
      <EditProfileModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        currentUser={userLogin}
      />
      {selectedPost && (
        <FullPostModal
          open={!!selectedPost}
          onClose={handleClosePostModal}
          post={selectedPost}
        />
      )}
      <FollowersList
        open={isFollowersListOpen}
        onClose={handleCloseFollowersList}
      />
      {isOwnProfile && (
        <AvatarUploadModal
          isVisible={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          userId={profileUser?.id || 0}
          currentAvatar={profileUser?.avatar || ""}
        />
      )}
    </Box>
  );
};

const TabPanel: React.FC<{
  children?: React.ReactNode;
  value: number;
  index: number;
}> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <span
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </span>
  );
};

export default Profile;
