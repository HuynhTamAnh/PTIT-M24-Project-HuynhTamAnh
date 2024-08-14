import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";
import Upload from "../../firebase/configFirebase";
import { IPosts } from "../../interface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createNewPost } from "../../store/slices/postsSlice";

interface UploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  userId: number;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isVisible,
  onClose,
  userId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [image, setImage] = useState<string[]>([]);

  const handleSubmit = () => {
    const newPost: Omit<IPosts, "id"> = {
      content,
      date: new Date().toISOString(),
      reactions: [],
      image,
      privacy,
      userId,
      comments: [],
    };

    dispatch(createNewPost(newPost));

    // Clear form and close modal
    setContent("");
    setPrivacy("public");
    setImage([]);
    onClose();
  };

  return (
    <Modal open={isVisible} onClose={onClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Upload Image
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="privacy-select-label">Privacy</InputLabel>
          <Select
            labelId="privacy-select-label"
            value={privacy}
            label="Privacy"
            onChange={(e) => setPrivacy(e.target.value as "public" | "private")}
          >
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </FormControl>
        <Upload images={image} setImages={setImage} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Đăng bài
        </Button>
      </Box>
    </Modal>
  );
};

export default UploadModal;
