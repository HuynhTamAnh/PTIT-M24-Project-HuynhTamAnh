// PostModal.tsx
import React, { useState } from "react";
import { Modal, Box, IconButton, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { IPosts } from "../../interface";

interface PostModalProps {
  open: boolean;
  onClose: () => void;
  post: IPosts;
}

const PostModal: React.FC<PostModalProps> = ({ open, onClose, post }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : post.image.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < post.image.length - 1 ? prev + 1 : 0
    );
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxWidth: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          outline: "none",
        }}
      >
        <Box sx={{ position: "relative", width: "100%", paddingTop: "100%" }}>
          <img
            src={post.image[currentImageIndex]}
            alt={`Post ${post.id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {post.image.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {post.content}
        </Typography>
      </Box>
    </Modal>
  );
};

export default PostModal;
