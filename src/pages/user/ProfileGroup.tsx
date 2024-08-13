import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
  CircularProgress,
  IconButton,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { AppDispatch, RootState } from "../../store";
import { GroupMember, GroupPost, IUsers } from "../../interface";
import GroupPostForm from "./GroupPostForm";
import {
  getGroupById,
  updateGroupInfo,
  addUserToGroup,
  removeUserFromGroup,
  createGroupPost,
  updateGroupAvatar,
  fetchUserById,
} from "../../store/slices/groupsSlice";
import FullPostModal from "./FullPostModal";

const ProfileGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const [memberUsers, setMemberUsers] = useState<IUsers[]>([]);
  const [selectedPost, setSelectedPost] = useState<GroupPost | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentGroup = useSelector(
    (state: RootState) => state.groupsSlice.currentGroup
  );
  const isLoading = useSelector(
    (state: RootState) => state.groupsSlice.isLoading
  );
  const error = useSelector((state: RootState) => state.groupsSlice.error);
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  );

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupById(parseInt(groupId)));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    if (currentGroup) {
      const fetchMembers = async () => {
        const memberPromises = currentGroup.members.map((member: GroupMember) =>
          dispatch(fetchUserById(member.userId))
        );
        const memberResults = await Promise.all(memberPromises);
        setMemberUsers(memberResults.map((result) => result.payload));
      };
      fetchMembers();
    }
  }, [currentGroup, dispatch]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const isGroupAdmin = currentGroup?.members.some(
    (member: GroupMember) => member.userId === userLogin?.id && member.role
  );

  const isMember = currentGroup?.members.some(
    (member: GroupMember) => member.userId === userLogin?.id
  );

  const handleCreatePost = async (
    postData: Omit<GroupPost, "idPostGroup" | "dateat">
  ) => {
    if (currentGroup && userLogin) {
      dispatch(createGroupPost({ groupId: currentGroup.id, postData }));
    }
  };

  const handleJoinLeaveGroup = async () => {
    if (currentGroup && userLogin) {
      if (isMember) {
        await dispatch(
          removeUserFromGroup({
            groupId: currentGroup.id,
            userId: userLogin.id,
          })
        );
      } else {
        await dispatch(
          addUserToGroup({ groupId: currentGroup.id, userId: userLogin.id })
        );
      }
    }
  };

  const handlePostClick = (post: GroupPost) => {
    setSelectedPost(post);
  };

  const handleClosePostModal = () => {
    setSelectedPost(null);
  };

  const handleAvatarClick = () => {
    if (isGroupAdmin && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && currentGroup) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        await dispatch(
          updateGroupAvatar({ groupId: currentGroup.id, avatar: base64String })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!currentGroup) {
    return <Typography>Group not found</Typography>;
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fff", color: "#000" }}>
      <Container sx={{ mt: 8 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} textAlign="center">
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  cursor: isGroupAdmin ? "pointer" : "default",
                }}
                src={currentGroup.avatar}
                onClick={handleAvatarClick}
              />
              {isGroupAdmin && (
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                  }}
                  onClick={handleAvatarClick}
                >
                  <CameraAltIcon />
                </IconButton>
              )}
            </Box>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              accept="image/*"
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
              {currentGroup.groupName}
            </Typography>
            {!isGroupAdmin && (
              <Button
                variant="contained"
                color={isMember ? "secondary" : "primary"}
                onClick={handleJoinLeaveGroup}
                sx={{ mt: 2 }}
              >
                {isMember ? "Leave Group" : "Join Group"}
              </Button>
            )}
            {(isMember || isGroupAdmin) && (
              <Box sx={{ mt: 2, px: 2 }}>
                <GroupPostForm
                  groupId={currentGroup.id}
                  userId={userLogin?.id || 0}
                  onSubmit={handleCreatePost}
                  compact={true}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {currentGroup.groupName}
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item>
                <Typography variant="body1">
                  <Badge
                    badgeContent={currentGroup.postGroup.length}
                    color="primary"
                  >
                    Posts
                  </Badge>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  <Badge
                    badgeContent={currentGroup.members.length}
                    color="primary"
                  >
                    Members
                  </Badge>
                </Typography>
              </Grid>
            </Grid>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{ mt: 2, borderBottom: 1, borderColor: "divider" }}
            >
              <Tab label="Posts" />
              <Tab label="Members" />
              <Tab label="About" />
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {currentGroup.postGroup.map((post: GroupPost) => (
                  <Grid item xs={12} sm={6} md={4} key={post.idPostGroup}>
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
                        src={post.img[0] || "https://via.placeholder.com/300"}
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
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {post.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Posted on: {new Date(post.dateat).toLocaleDateString()}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={2}>
                {currentGroup.members.map((member: GroupMember) => {
                  const user = memberUsers.find((u) => u.id === member.userId);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={member.userId}>
                      <Box display="flex" alignItems="center">
                        <Avatar src={user?.avatar} sx={{ mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1">
                            {user ? user.username : `User ${member.userId}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.role ? "Admin" : "Member"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Joined:{" "}
                            {new Date(member.dateJoin).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <Typography>Group created on: {currentGroup.dateAt}</Typography>
              <Typography>
                Status: {currentGroup.status ? "Active" : "Inactive"}
              </Typography>
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
      {selectedPost && (
        <FullPostModal
          open={!!selectedPost}
          onClose={handleClosePostModal}
          post={selectedPost}
          groupId={currentGroup.id}
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default ProfileGroup;
