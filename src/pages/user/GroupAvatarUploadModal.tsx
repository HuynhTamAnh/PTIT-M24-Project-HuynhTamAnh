import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface GroupAvatarUploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAvatarChange: (file: File) => void;
}

const GroupAvatarUploadModal: React.FC<GroupAvatarUploadModalProps> = ({
  isVisible,
  onClose,
  onAvatarChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onAvatarChange(selectedFile);
      onClose();
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <DialogTitle>Upload Group Avatar</DialogTitle>
      <DialogContent>
        <Box sx={{ textAlign: "center", my: 2 }}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="group-avatar-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="group-avatar-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Select Image
            </Button>
          </label>
        </Box>
        {previewUrl && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: "100%", maxHeight: "200px" }}
            />
          </Box>
        )}
        {!previewUrl && (
          <Typography variant="body2" color="text.secondary" align="center">
            No image selected
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpload} disabled={!selectedFile} color="primary">
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupAvatarUploadModal;
