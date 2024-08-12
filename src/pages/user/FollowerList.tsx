// FollowersList.tsx
import React, { useEffect, useState } from "react";
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
  Box,
  Tabs,
  Tab,
  TextField,
  Badge,
  Button,
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { IUsers } from "../../interface";
import { getAllUsers } from "../../store/slices/friendsSlice";
import {
  sendFriendRequest,
  cancelFriendRequest,
  rejectFriendRequest,
  acceptFriendRequest,
} from "../../store/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { CustomTabPanel } from "../../components/CustomTabPanel";
import { useNavigate } from "react-router-dom";

interface FollowersListProps {
  open: boolean;
  onClose: () => void;
}

const FollowersList: React.FC<FollowersListProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { friendsList } = useSelector((state: RootState) => state.friendsSlice);
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const currentProfileFriends = useSelector(
    (state: RootState) => state.usersSlice.currentProfileFriends
  );
  // const isOwnProfile = userLogin?.id === parseInt(userId);
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleRejectFriendRequest = (requesterId: number) => {
    if (userLogin) {
      dispatch(rejectFriendRequest({ rejecterId: userLogin.id, requesterId }));
    }
  };
  const handleSendFriendRequest = (receiverId: number) => {
    if (userLogin) {
      dispatch(sendFriendRequest({ senderId: userLogin.id, receiverId }));
    }
  };

  const handleCancelFriendRequest = (receiverId: number) => {
    if (userLogin) {
      dispatch(cancelFriendRequest({ senderId: userLogin.id, receiverId }));
    }
  };

  const handleAcceptFriendRequest = (requesterId: number) => {
    if (userLogin) {
      dispatch(acceptFriendRequest({ accepterId: userLogin.id, requesterId }));
    }
  };

  const filterFriends = () => {
    if (!userLogin || !userLogin.friends) return [];
    return friendsList.filter((user: IUsers) =>
      userLogin.friends?.some(
        (friend) => user.id === friend.userId && friend.status
      )
    );
  };

  const filterNonFriends = () => {
    if (!userLogin || !userLogin.friends) return [];
    return friendsList.filter(
      (user: IUsers) =>
        user.id !== userLogin.id &&
        user.role === "user" &&
        !userLogin.friends?.some(
          (friend) => friend.userId === user.id && friend.status
        )
    );
  };

  const searchUsers = (users: IUsers[]) => {
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const navigate = useNavigate();
  const filteredFriends = searchUsers(filterFriends());
  const filteredNonFriends = searchUsers(filterNonFriends());
  const friendCount = filteredFriends.length;
  const friendRequestCount =
    userLogin?.notify?.filter((notif) =>
      notif[1].includes("đã gửi lời mời kết bạn")
    ).length || 0;
  const suggestedFriendCount = filteredNonFriends.length;
  const handleNavigateToProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
    onClose();
  };
  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
          Người theo dõi
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={
                <Badge
                  badgeContent={friendCount || null}
                  color="primary"
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  Bạn bè
                </Badge>
              }
              {...a11yProps(0)}
            />
            <Tab
              label={
                <Badge
                  badgeContent={friendRequestCount || null}
                  color="primary"
                >
                  Lời mời kết bạn
                </Badge>
              }
              {...a11yProps(1)}
            />
            <Tab
              label={
                <Badge
                  badgeContent={suggestedFriendCount || null}
                  color="primary"
                >
                  Gợi ý kết bạn
                </Badge>
              }
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
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

      <CustomTabPanel value={value} index={0}>
        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            label="Tìm kiếm bạn bè"
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
        <List sx={{ pt: 0 }}>
          {currentProfileFriends
            .filter((friend: any) =>
              friend.username.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((friend: IUsers) => (
              <ListItem button key={friend.id}>
                <ListItemAvatar>
                  <Avatar src={friend.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.username}
                  secondary={friend.email}
                  onClick={() => handleNavigateToProfile(friend.id)}
                  sx={{ cursor: "pointer" }}
                />
              </ListItem>
            ))}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <List sx={{ pt: 0 }}>
          {userLogin?.notify
            ?.filter((notif) => notif[1].includes("đã gửi lời mời kết bạn"))
            .map((notif, index) => {
              const requesterId = parseInt(notif[0]);
              const requester = friendsList.find(
                (user: IUsers) => user.id === requesterId
              );
              return (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={requester?.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={requester?.username || `User ID: ${requesterId}`}
                    secondary={`Ngày gửi: ${new Date(
                      notif[2]
                    ).toLocaleString()}`}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleAcceptFriendRequest(requesterId)}
                    sx={{ mr: 1 }}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleRejectFriendRequest(requesterId)}
                    color="error"
                  >
                    Từ chối
                  </Button>
                </ListItem>
              );
            })}
        </List>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            label="Tìm kiếm gợi ý kết bạn"
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
        <List sx={{ pt: 0 }}>
          {filteredNonFriends.map((user: IUsers) => (
            <ListItem
              button
              key={user.id}
              secondaryAction={
                userLogin?.friends?.some(
                  (friend) => friend.userId === user.id && !friend.status
                ) ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleCancelFriendRequest(user.id)}
                  >
                    Huỷ
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSendFriendRequest(user.id)}
                  >
                    Kết bạn
                  </Button>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={user.email}
                onClick={() => handleNavigateToProfile(user.id)}
                sx={{ cursor: "pointer" }}
              />
            </ListItem>
          ))}
        </List>
      </CustomTabPanel>
    </Dialog>
  );
};

export default FollowersList;
