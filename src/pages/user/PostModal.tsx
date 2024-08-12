// FullPostModal.tsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Avatar,
  CardHeader,
  CardActions,
  CardContent,
  TextField,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ChatBubbleOutline as CommentIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IPosts, IUsers } from "../../interface";
import { RootState, AppDispatch } from "../../store";
import {
  addReaction,
  removeReaction,
  addComment,
} from "../../store/slices/postsSlice";

interface FullPostModalProps {
  open: boolean;
  onClose: () => void;
  post: IPosts;
}

const FullPostModal: React.FC<FullPostModalProps> = ({
  open,
  onClose,
  post,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentText, setCommentText] = useState("");

  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;
  const accounts = useSelector((state: RootState) => state.postsSlice.accounts);

  const getUserInfoById = (id: number) => {
    return accounts.find((user: IUsers) => user.id === id) || {};
  };

  const userInfo = getUserInfoById(post.userId);

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + post.image.length) % post.image.length
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.image.length);
  };

  const handleReaction = () => {
    if (userLogin) {
      const hasReacted = post.reactions.includes(userLogin.id.toString());
      if (hasReacted) {
        dispatch(removeReaction({ postId: post.id, userId: userLogin.id }));
      } else {
        dispatch(addReaction({ postId: post.id, userId: userLogin.id }));
      }
    }
  };

  const handleComment = () => {
    if (userLogin && commentText.trim() !== "") {
      dispatch(
        addComment({
          postId: post.id,
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

  const formatDate = (dateString: string) => {
    const formattedDateString = dateString.replace(/:00Z$/, "Z");
    return new Date(formattedDateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent sx={{ p: 0, display: "flex" }}>
        <Box
          sx={{
            position: "relative",
            width: "60%",
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "black",
          }}
        >
          <img
            src={post.image[currentImageIndex]}
            alt={`Post image ${currentImageIndex + 1}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
          {post.image.length > 1 && (
            <>
              <IconButton
                sx={{ position: "absolute", left: 8, top: "50%" }}
                onClick={handlePrevImage}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                sx={{ position: "absolute", right: 8, top: "50%" }}
                onClick={handleNextImage}
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
        <Box
          sx={{ width: "40%", p: 2, display: "flex", flexDirection: "column" }}
        >
          <CardHeader
            avatar={<Avatar src={userInfo.avatar} />}
            title={userInfo.name}
            subheader={formatDate(post.date)}
          />
          <CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
            <Typography variant="body2" color="text.secondary">
              {post.content}
            </Typography>
            {post.comments &&
              post.comments.map((comment, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    component="span"
                    fontWeight="bold"
                  >
                    {getUserInfoById(comment.userId).name}:
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                    {comment.content}
                  </Typography>
                </Box>
              ))}
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites" onClick={handleReaction}>
              {post.reactions.includes(userLogin?.id.toString()) ? (
                <FavoriteIcon color="secondary" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <IconButton aria-label="comment">
              <CommentIcon />
            </IconButton>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: "auto" }}
            >
              {post.reactions.length} likes
            </Typography>
          </CardActions>
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
            <IconButton color="primary" onClick={handleComment}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FullPostModal;
