import React, { useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../config/index";

interface UploadProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

const Upload: React.FC<UploadProps> = ({ images, setImages }) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const storageRef = ref(storage, `images/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return getDownloadURL(snapshot.ref);
      });

      const downloadUrls = await Promise.all(uploadPromises);
      setImages((prevImages) => [...prevImages, ...downloadUrls]);
    } catch (err) {
      console.error(err);
      console.error("Error uploading files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="raised-button-file"
        type="file"
        onChange={handleFileChange}
        multiple
      />
      <label htmlFor="raised-button-file">
        <Button
          variant="contained"
          component="span"
          startIcon={
            uploading ? <CircularProgress size={24} /> : <CloudUploadIcon />
          }
          disabled={uploading}
        >
          {uploading ? "Uploading" : "Select Files"}
        </Button>
      </label>

      <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
        {images.map((image, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              src={image}
              alt={`Uploaded ${index}`}
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
            <IconButton
              size="small"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "rgba(255,255,255,0.7)",
              }}
              onClick={() => handleRemoveImage(index)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upload;
