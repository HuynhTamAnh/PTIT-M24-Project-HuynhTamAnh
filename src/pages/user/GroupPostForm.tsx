import React, { useState, useRef } from "react";
import { Box, TextField, Button, IconButton } from "@mui/material";
import { GroupPost } from "../../interface";
import CloseIcon from "@mui/icons-material/Close";

interface GroupPostFormProps {
  groupId: number;
  userId: number;
  onSubmit: (postData: Omit<GroupPost, "idPostGroup" | "dateat">) => void;
  compact?: boolean;
}

const GroupPostForm: React.FC<GroupPostFormProps> = ({
  groupId,
  userId,
  onSubmit,
  compact = false,
}) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || image) {
      const postData: Omit<GroupPost, "idPostGroup" | "dateat"> = {
        userId,
        content,
        img: image ? [URL.createObjectURL(image)] : [],
        likes: [],
        comments: [],
      };
      onSubmit(postData);
      setContent("");
      setImage(null);
      setPreviewUrl(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <TextField
          multiline
          rows={compact ? 2 : 4}
          variant="outlined"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          size={compact ? "small" : "medium"}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
          id="image-upload"
          ref={fileInputRef}
        />
        {previewUrl && (
          <Box sx={{ position: "relative", width: 100, height: 100, mb: 1 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: "rgba(255,255,255,0.7)",
              }}
              onClick={handleRemoveImage}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor="image-upload">
            <Button component="span" size={compact ? "small" : "medium"}>
              Add Image
            </Button>
          </label>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size={compact ? "small" : "medium"}
          >
            Post
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default GroupPostForm;
