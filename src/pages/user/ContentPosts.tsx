import React, { useEffect } from "react";
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
} from "@mui/material";
import {
  Favorite as FavoriteIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IPosts } from "../../interface";
import { AppDispatch, RootState } from "../../store";
import {
  getAllUsersInfo,
  getNewPosts,
  UserInfo,
} from "../../store/slices/postsSlice";
import { useNavigate } from "react-router-dom";

const ContentPosts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { posts, accounts } = useSelector(
    (state: RootState) => state.postsSlice
  );

  useEffect(() => {
    dispatch(getAllUsersInfo());
    dispatch(getNewPosts());
  }, []);

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
  console.log(accounts);

  return (
    <>
      {posts.map((post: IPosts) => (
        <Card key={post.id} sx={{ mb: 2, bgcolor: "background.paper" }}>
          <CardHeader
            avatar={
              <Avatar
                src={getUserInfoById(post.userId).avatar}
                onClick={() => handleAvatarClick(post.userId)}
                style={{ cursor: "pointer" }}
              />
            }
            title={getUserInfoById(post.userId).name}
            subheader={formatDate(post.date)}
          />
          {post.image && post.image.length > 0 && (
            <ImageList cols={post.image.length > 1 ? 2 : 1} rowHeight={300}>
              {post.image.map((img, index) => (
                <ImageListItem key={index}>
                  <img
                    src={img}
                    alt={`Post ${post.id} - Image ${index + 1}`}
                    loading="lazy"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <Box sx={{ p: 2 }}>
            <Typography variant="body1">{post.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              Reactions: {post.reactions.join(", ")}
            </Typography>
          </Box>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <SendIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
      {posts.length === 0 && <Typography>No posts available.</Typography>}
    </>
  );
};

export default ContentPosts;
