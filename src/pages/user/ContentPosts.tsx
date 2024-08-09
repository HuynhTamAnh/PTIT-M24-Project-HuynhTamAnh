import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  ImageList,
  ImageListItem,
  CardContent,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  PublicOutlined,
} from "@mui/icons-material";
import { IUsers, IPosts } from "../../interface";
import { AppDispatch, RootState } from "../../store";
import {
  getAllUsersInfo,
  getNewPosts,
  UserInfo,
  deletePost,
  updatePost,
} from "../../store/slices/postsSlice";
import { useNavigate } from "react-router-dom";

const ContentPosts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPost, setSelectedPost] = useState<IPosts | null>(null);

  useEffect(() => {
    dispatch(getNewPosts());
    dispatch(getAllUsersInfo());
  }, []);

  const { posts, accounts } = useSelector(
    (state: RootState) => state.postsSlice
  );

  const formatDate = (dateString: string) => {
    const formattedDateString = dateString.replace(/:00Z$/, "Z");
    return new Date(formattedDateString).toLocaleDateString();
  };

  const handleAvatarClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  const getUserInfoById = (id: number): UserInfo => {
    return accounts.find((user: UserInfo) => user.id === id);
  };

  const handleOptionsClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    post: IPosts
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleDeletePost = () => {
    if (selectedPost) {
      dispatch(deletePost(selectedPost.id));
    }
    handleClose();
  };

  const handleUpdatePrivacy = (privacy: "public" | "private") => {
    if (selectedPost) {
      dispatch(updatePost({ id: selectedPost.id, data: { privacy } }));
    }
    handleClose();
  };

  return (
    <>
      {posts.map((post: IPosts) => {
        const canViewPost =
          post.privacy === "public" || post.userId === userLogin?.id;

        const userInfo = getUserInfoById(post.userId);

        if (canViewPost) {
          return (
            <Card key={post.id} sx={{ mb: 2, bgcolor: "background.paper" }}>
              <CardHeader
                avatar={
                  <Avatar
                    src={userInfo?.avatar}
                    onClick={() => handleAvatarClick(post.userId)}
                    style={{ cursor: "pointer" }}
                  />
                }
                action={
                  post.userId === userLogin?.id && (
                    <IconButton
                      aria-label="settings"
                      onClick={(e) => handleOptionsClick(e, post)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )
                }
                title={userInfo?.name}
                subheader={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span>{formatDate(post.date)}</span>
                    <PublicOutlined
                      sx={{ fontSize: 16, marginBottom: "2px" }}
                    />
                  </div>
                }
              />

              {post.image && post.image.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    maxHeight: 400,
                    overflow: "hidden",
                  }}
                >
                  <ImageList
                    cols={post.image.length > 1 ? 2 : 1}
                    gap={8}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {post.image.map((img, index) => (
                      <ImageListItem
                        key={index}
                        sx={{ height: "100% !important" }}
                      >
                        <img
                          src={img}
                          alt={`Post image ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {post.content}
                </Typography>
              </CardContent>

              <CardActions>
                <Typography variant="body2" color="text.secondary">
                  Reactions: {post.reactions.join(", ")}
                </Typography>
              </CardActions>
            </Card>
          );
        }

        return null;
      })}

      {posts.length === 0 && <Typography>No posts available.</Typography>}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
        <MenuItem onClick={() => handleUpdatePrivacy("public")}>
          Make Public
        </MenuItem>
        <MenuItem onClick={() => handleUpdatePrivacy("private")}>
          Make Private
        </MenuItem>
      </Menu>
    </>
  );
};

export default ContentPosts;
