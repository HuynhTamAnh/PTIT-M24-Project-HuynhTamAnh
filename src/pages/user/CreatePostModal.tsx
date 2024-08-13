// CreatePostModal.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (postData: { content: string; img: string[] }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = () => {
    onSubmit({ content, img: image ? [image] : [] });
    setContent("");
    setImage("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Post content"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Image URL"
          type="text"
          fullWidth
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        {image && (
          <Box mt={2}>
            <img
              src={image}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostModal;
