// EditProfileModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
} from "@mui/material";
import { IUsers } from "../../interface";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<IUsers>) => void;
  currentUser: IUsers | null;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  onClose,
  onSave,
  currentUser,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || "");
      // setAvatar(currentUser.avatar || "");
    }
  }, [currentUser]);

  const handleSave = () => {
    onSave({
      username,
      email,
      phone,
      // avatar,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography variant="h6" component="h2" gutterBottom>
          Chỉnh sửa thông tin cá nhân
        </Typography>
        {/* <Avatar
          src={avatar}
          sx={{ width: 100, height: 100, mx: "auto", my: 2 }}
        />
        <TextField
          fullWidth
          label="Avatar URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          margin="normal"
        /> */}
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          margin="normal"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            Hủy
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
