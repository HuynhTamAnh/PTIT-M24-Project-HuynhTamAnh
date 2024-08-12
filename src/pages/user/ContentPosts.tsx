// ContentPosts.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  CardContent,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogContent,
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
  MoreVert as MoreVertIcon,
  PublicOutlined,
  LockOutlined,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { IUsers, IPosts } from "../../interface";
import { AppDispatch, RootState } from "../../store";
import {
  getAllUsersInfo,
  getNewPosts,
  UserInfo,
  deletePost,
  updatePost,
  addReaction,
  removeReaction,
  addComment,
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
  const [commentText, setCommentText] = useState<string>("");
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{
    [key: number]: number;
  }>({});
  const [enlargedPost, setEnlargedPost] = useState<IPosts | null>(null);

  useEffect(() => {
    dispatch(getNewPosts());
    dispatch(getAllUsersInfo());
  }, [dispatch]);

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
    return (
      accounts.find((user: UserInfo) => user.id === id) || ({} as UserInfo)
    );
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

  const handleReaction = (postId: number) => {
    if (userLogin) {
      const hasReacted = posts.find(
        (post: any) =>
          post.id === postId && post.reactions.includes(userLogin.id.toString())
      );
      if (hasReacted) {
        dispatch(removeReaction({ postId, userId: userLogin.id }));
      } else {
        dispatch(addReaction({ postId, userId: userLogin.id }));
      }
    }
  };

  const handleComment = (postId: number) => {
    if (userLogin && commentText.trim() !== "") {
      dispatch(
        addComment({
          postId,
          comment: {
            userId: userLogin.id,
            content: commentText,
            date: new Date().toISOString(),
          },
        })
      );
      setCommentText("");
    }
  };

  const handleShare = (postId: number) => {
    // Implement share functionality
    console.log(`Sharing post ${postId}`);
  };

  const handleNextImage = (postId: number) => {
    setCurrentImageIndexes((prev) => {
      const currentIndex = prev[postId] || 0;
      const post = posts.find((p: IPosts) => p.id === postId);
      if (post) {
        return {
          ...prev,
          [postId]: (currentIndex + 1) % post.image.length,
        };
      }
      return prev;
    });
  };

  const handlePrevImage = (postId: number) => {
    setCurrentImageIndexes((prev) => {
      const currentIndex = prev[postId] || 0;
      const post = posts.find((p: IPosts) => p.id === postId);
      if (post) {
        return {
          ...prev,
          [postId]: (currentIndex - 1 + post.image.length) % post.image.length,
        };
      }
      return prev;
    });
  };

  const handleImageClick = (post: IPosts) => {
    setEnlargedPost(post);
  };

  const handleCloseEnlarged = () => {
    setEnlargedPost(null);
  };

  return (
    <>
      {posts.map((post: IPosts) => {
        const canViewPost =
          post.privacy === "public" || post.userId === userLogin?.id;

        const userInfo = getUserInfoById(post.userId);
        const currentImageIndex = currentImageIndexes[post.id] || 0;

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
                    {post.privacy === "public" ? (
                      <PublicOutlined
                        sx={{ fontSize: 16, marginBottom: "2px" }}
                      />
                    ) : (
                      <LockOutlined
                        sx={{ fontSize: 16, marginBottom: "2px" }}
                      />
                    )}
                  </div>
                }
              />

              {post.image && post.image.length > 0 && (
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 400,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={post.image[currentImageIndex]}
                    alt={`Post image ${currentImageIndex + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() => handleImageClick(post)}
                  />
                  {post.image.length > 1 && (
                    <>
                      <IconButton
                        sx={{ position: "absolute", left: 8, top: "50%" }}
                        onClick={() => handlePrevImage(post.id)}
                      >
                        <ChevronLeft />
                      </IconButton>
                      <IconButton
                        sx={{ position: "absolute", right: 8, top: "50%" }}
                        onClick={() => handleNextImage(post.id)}
                      >
                        <ChevronRight />
                      </IconButton>
                      <Typography
                        sx={{
                          position: "absolute",
                          right: 8,
                          bottom: 8,
                          bgcolor: "rgba(0,0,0,0.6)",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: 1,
                        }}
                      >
                        {currentImageIndex + 1} / {post.image.length}
                      </Typography>
                    </>
                  )}
                </Box>
              )}

              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={() => handleReaction(post.id)}
                >
                  {post.reactions.includes(userLogin?.id.toString()) ? (
                    <FavoriteIcon color="secondary" />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </IconButton>
                <IconButton aria-label="comment">
                  <CommentIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={() => handleShare(post.id)}
                >
                  <SendIcon />
                </IconButton>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ marginLeft: "auto" }}
                >
                  {post.reactions.length} likes
                </Typography>
              </CardActions>

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {post.content}
                </Typography>
                {post.comments && post.comments.length > 0 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    View all {post.comments.length} comments
                  </Typography>
                )}
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Add a comment..."
                    fullWidth
                    sx={{ mr: 1 }}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => handleComment(post.id)}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </CardContent>
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

      <Dialog
        open={!!enlargedPost}
        onClose={handleCloseEnlarged}
        maxWidth="md" // Change from "lg" to "md" for a slightly smaller dialog
      >
        <DialogContent sx={{ p: 0 }}>
          {" "}
          {enlargedPost && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "70vh", // Set a fixed height for the dialog content
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "black", // Add a black background
              }}
            >
              <img
                src={
                  enlargedPost.image[currentImageIndexes[enlargedPost.id] || 0]
                }
                alt="Enlarged post image"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain", // Ensure the image fits within the container
                }}
              />
              {/* Navigation buttons and image counter remain the same */}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentPosts;
