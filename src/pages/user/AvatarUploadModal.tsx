import React, { useState } from "react";
import { Modal, Box, Typography, Button, Avatar } from "@mui/material";
import Upload from "../../firebase/configFirebase";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { updateUserProfile } from "../../store/slices/usersSlice";
import { useSelector } from "react-redux";
import { IUsers } from "../../interface";

interface AvatarUploadModalProps {
  isVisible: boolean;
  onClose: () => void;
  userId: number;
  currentAvatar: string;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isVisible,
  onClose,
  userId,
  currentAvatar,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newAvatar, setNewAvatar] = useState<string[]>([]);
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;

  const handleSubmit = () => {
    if (newAvatar.length > 0 && userLogin && userLogin.id === userId) {
      dispatch(updateUserProfile({ id: userId, avatar: newAvatar[0] }));
      onClose();
      setNewAvatar([]);
    }
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          Upload New Avatar
        </Typography>
        <Avatar
          src={newAvatar.length > 0 ? newAvatar[0] : currentAvatar}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Upload images={newAvatar} setImages={setNewAvatar} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          disabled={newAvatar.length === 0}
        >
          Update Avatar
        </Button>
      </Box>
    </Modal>
  );
};

export default AvatarUploadModal;
