// FollowersList.tsx
import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { IUsers } from "../../interface";
import { getAllUsers } from "../../store/slices/friendsSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface FollowersListProps {
  open: boolean;
  onClose: () => void;
}

const FollowersList: React.FC<FollowersListProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const filterFriends = () => {
    //duyệt qua mảng friends, kiểm tra id của từng phần tử trong friend nếu id nằm trong mảng friends thì add vào filter, không thì bỏ qua
    return friendsList.filter((user: IUsers) => {
      return (userLogin as IUsers).friends.some(
        (friend) => user.id === friend.userId
      );
    });
  };
  const { friendsList } = useSelector((state: RootState) => state.friendsSlice);
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;
  useEffect(() => {
    dispatch(getAllUsers(null));
  }, []);
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          Người theo dõi
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {filterFriends().map((friend: any) => (
          <ListItem button key={friend.id}>
            <ListItemAvatar>
              <Avatar src={friend.avatar} />
            </ListItemAvatar>
            <ListItemText primary={friend.username} secondary={friend.email} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};

export default FollowersList;
