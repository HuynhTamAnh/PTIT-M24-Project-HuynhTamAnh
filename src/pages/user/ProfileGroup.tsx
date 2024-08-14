import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { notification } from "antd";
import {
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Tabs,
  Tab,
  Badge,
  Skeleton,
} from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../store";
import GroupAvatarUploadModal from "./GroupAvatarUploadModal";

import {
  getGroupById,
  updateGroupInfo,
  addUserToGroup,
  removeUserFromGroup,
  updateGroupAvatar,
  createGroupPost,
} from "../../store/slices/groupsSlice";
import { Group, GroupMember, GroupPost } from "../../interface";
import GroupPostForm from "./GroupPostForm";
import FullPostModal from "./FullPostModal";

const ProfileGroup: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { currentGroup, isLoading, error } = useSelector(
    (state: RootState) => state.groupsSlice
  );
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  );
  useEffect(() => {
    console.log("Current group updated:", currentGroup);
  }, [currentGroup]);
  const [editMode, setEditMode] = useState(false);
  const [editedGroupName, setEditedGroupName] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GroupPost | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (groupId) {
      dispatch(getGroupById(parseInt(groupId)));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    if (currentGroup && currentGroup.isLocked) {
      notification.error({
        message: "Group Locked",
        description: "This group is currently locked and cannot be accessed.",
      });
      navigate("/groups");
    }
  }, [currentGroup, navigate]);

  if (!currentGroup || currentGroup.isLocked) {
    return null;
  }

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!currentGroup) return <Typography>Group not found.</Typography>;

  const isCreator = currentGroup.members.some(
    (member: GroupMember) => member.userId === userLogin?.id && member.role
  );
  const isMember = currentGroup.members.some(
    (member: GroupMember) => member.userId === userLogin?.id
  );

  const handleJoinLeaveGroup = () => {
    if (userLogin) {
      if (isMember) {
        dispatch(
          removeUserFromGroup({
            groupId: currentGroup.id,
            userId: userLogin.id,
          })
        );
      } else {
        dispatch(
          addUserToGroup({ groupId: currentGroup.id, userId: userLogin.id })
        );
      }
    }
  };

  const handleEditGroup = () => {
    setEditMode(true);
    setEditedGroupName(currentGroup.groupName);
  };

  const handleSaveEdit = () => {
    if (editedGroupName.trim() && editedGroupName !== currentGroup.groupName) {
      dispatch(
        updateGroupInfo({
          groupId: currentGroup.id,
          data: { groupName: editedGroupName },
        })
      );
    }
    setEditMode(false);
  };

  const handleCreatePost = (
    postData: Omit<GroupPost, "idPostGroup" | "dateat">
  ) => {
    if (currentGroup) {
      dispatch(createGroupPost({ groupId: currentGroup.id, postData }));
    }
  };

  const handleOpenPost = (post: GroupPost) => {
    setSelectedPost(post);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAvatarClick = () => {
    if (isCreator) {
      setIsAvatarModalOpen(true);
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (file && currentGroup) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        console.log("Dispatching updateGroupAvatar");
        const result = await dispatch(
          updateGroupAvatar({ groupId: currentGroup.id, avatar: formData })
        );
        console.log("Avatar update response:", result);
        setIsAvatarModalOpen(false);

        // Force re-render
        dispatch(getGroupById(currentGroup.id));
      } catch (error) {
        console.error("Failed to update group avatar:", error);
        notification.error({
          message: "Avatar Update Failed",
          description: "Failed to update the group avatar. Please try again.",
        });
      }
    }
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

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fff", color: "#000" }}>
      <Container sx={{ mt: 8 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} textAlign="center">
            {isLoading ? (
              <Skeleton variant="circular" width={100} height={100} />
            ) : error ? (
              <Avatar sx={{ width: 100, height: 100, mx: "auto" }}>
                Error
              </Avatar>
            ) : (
              <Avatar
                src={
                  typeof currentGroup?.avatar === "string"
                    ? currentGroup.avatar
                    : (currentGroup?.avatar as any)?.url ||
                      "/default-group-avatar.png"
                }
                alt={currentGroup?.groupName}
                sx={{
                  width: 100,
                  height: 100,
                  mx: "auto",
                  cursor: isCreator ? "pointer" : "default",
                }}
                onClick={handleAvatarClick}
              />
            )}
            <Typography variant="h6" sx={{ mt: 2 }}>
              {currentGroup?.groupName}
            </Typography>
          </Grid>
          <GroupAvatarUploadModal
            isVisible={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            onAvatarChange={handleAvatarChange}
          />
          <Grid item xs={12} md={9}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {editMode ? (
                <TextField
                  fullWidth
                  value={editedGroupName}
                  onChange={(e) => setEditedGroupName(e.target.value)}
                />
              ) : (
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                  {currentGroup.groupName}
                </Typography>
              )}
              {isCreator && (
                <>
                  {editMode ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveEdit}
                      sx={{ ml: 2 }}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{
                        mx: 1,
                        backgroundColor: "#333",
                        padding: "5px 10px",
                        fontSize: "0.875rem",
                      }}
                      startIcon={<SettingsIcon />}
                      onClick={handleEditGroup}
                    >
                      Edit
                    </Button>
                  )}
                </>
              )}
              {!isCreator && (
                <Button
                  variant="contained"
                  color={isMember ? "secondary" : "primary"}
                  onClick={handleJoinLeaveGroup}
                  sx={{ ml: 2 }}
                >
                  {isMember ? "Leave Group" : "Join Group"}
                </Button>
              )}
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
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
              <Grid item>
                <Typography variant="body1">
                  <Badge
                    badgeContent={currentGroup.postGroup?.length || 0}
                    color="primary"
                  >
                    Posts
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
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              {userLogin && isMember && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Create a new post
                  </Typography>
                  <GroupPostForm
                    groupId={currentGroup.id}
                    userId={userLogin.id}
                    onSubmit={handleCreatePost}
                  />
                </Box>
              )}
              <Grid container spacing={2}>
                {currentGroup.postGroup && currentGroup.postGroup.length > 0 ? (
                  currentGroup.postGroup.map((post: GroupPost) => (
                    <Grid item xs={12} sm={6} md={4} key={post.idPostGroup}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenPost(post)}
                      >
                        {post.img && post.img.length > 0 && (
                          <Box sx={{ mb: 1, flexGrow: 1 }}>
                            <img
                              src={post.img[0]}
                              alt="Post image"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                            />
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.dateat).toLocaleString()}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography>No posts yet.</Typography>
                  </Grid>
                )}
              </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <List>
                {currentGroup.members.map((member: GroupMember) => (
                  <React.Fragment key={member.userId}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          src={`https://via.placeholder.com/40?text=${member.userId}`}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={`User ${member.userId}`}
                        secondary={member.role ? "Creator" : "Member"}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          </Grid>
        </Grid>
      </Container>

      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this group? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {selectedPost && (
        <FullPostModal
          open={!!selectedPost}
          onClose={handleClosePost}
          post={selectedPost}
          groupId={currentGroup.id}
        />
      )}
    </Box>
  );
};

export default ProfileGroup;
