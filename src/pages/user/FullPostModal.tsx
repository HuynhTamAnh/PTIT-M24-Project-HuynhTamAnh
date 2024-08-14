import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { GroupPost } from "../../interface";
import { AppDispatch, RootState } from "../../store";
import {
  updateGroupPost,
  deleteGroupPost,
} from "../../store/slices/groupsSlice";

interface FullPostModalProps {
  open: boolean;
  onClose: () => void;
  post: GroupPost;
  groupId: number;
}

const FullPostModal: React.FC<FullPostModalProps> = ({
  open,
  onClose,
  post,
  groupId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLike = () => {
    // Implement like functionality
  };

  const handleComment = () => {
    if (comment.trim()) {
      const updatedPost = {
        ...post,
        comments: [
          ...(post.comments || []),
          {
            userId: userLogin?.id,
            content: comment,
            date: new Date().toISOString(),
          },
        ],
      };
      dispatch(
        updateGroupPost({ groupId, postId: post.idPostGroup, updatedPost })
      );
      setComment("");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleCloseMenu();
  };

  const handleSaveEdit = () => {
    const updatedPost = { ...post, content: editedContent };
    dispatch(
      updateGroupPost({ groupId, postId: post.idPostGroup, updatedPost })
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deleteGroupPost({ groupId, postId: post.idPostGroup }))
      .unwrap()
      .then(() => {
        handleCloseMenu();
        onClose();
      })
      .catch((error: any) => {
        console.error("Failed to delete post:", error);
      });
  };

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0, display: "flex", height: "80vh" }}>
        <Box
          sx={{
            width: "60%",
            bgcolor: "black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={post.img[0] || "https://via.placeholder.com/300"}
            alt={post.content}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </Box>
        <Box
          sx={{ width: "40%", p: 2, display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={userLogin?.avatar} sx={{ mr: 1 }} />
              <Typography variant="subtitle1">{userLogin?.username}</Typography>
            </Box>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
            Posted on: {formatDate(post.dateat)}
          </Typography>
          {isEditing ? (
            <>
              <TextField
                multiline
                rows={4}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </>
          ) : (
            <Typography sx={{ mb: 2 }}>{post.content}</Typography>
          )}
          <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
            {post.comments &&
              post.comments.map((comment, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">{comment.userId}</Typography>
                  <Typography variant="body2">{comment.content}</Typography>
                </Box>
              ))}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={handleLike}>
              {post.likes && post.likes.includes(userLogin?.id || 0) ? (
                <FavoriteIcon color="secondary" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography>{post.likes ? post.likes.length : 0} likes</Typography>
            {userLogin?.id === post.userId && (
              <IconButton sx={{ ml: "auto" }} onClick={handleOpenMenu}>
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: "flex" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" onClick={handleComment}>
              Post
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleEdit}>Edit post</MenuItem>
        <MenuItem onClick={handleDelete}>Delete post</MenuItem>
      </Menu>
    </Dialog>
  );
};

export default FullPostModal;
