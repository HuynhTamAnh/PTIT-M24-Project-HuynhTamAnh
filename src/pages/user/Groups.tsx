import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardActionArea,
} from "@mui/material";
import { AppDispatch, RootState } from "../../store";
import {
  allGroups,
  createGroup,
  addUserToGroup,
  removeUserFromGroup,
} from "../../store/slices/groupsSlice";
import { Group, GroupMember } from "../../interface";

const Groups: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { groups, isLoading, error } = useSelector(
    (state: RootState) => state.groupsSlice
  );
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  );
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  useEffect(() => {
    dispatch(allGroups());
  }, [dispatch]);

  const handleCreateGroup = async () => {
    if (newGroupName.trim() && userLogin) {
      try {
        await dispatch(
          createGroup({
            groupName: newGroupName,
            dateAt: new Date().toISOString(),
            avatar: "",
            status: true,
            members: [
              {
                userId: userLogin.id,
                role: true,
                dateJoin: new Date().toISOString(),
              },
            ],
            postGroup: [],
          } as Omit<Group, "id">)
        ).unwrap();
        setOpenCreateDialog(false);
        setNewGroupName("");
      } catch (error) {
        console.error("Failed to create group:", error);
      }
    }
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  const handleJoinLeaveGroup = (event: React.MouseEvent, group: Group) => {
    event.stopPropagation();
    if (userLogin) {
      const isMember = group.members.some(
        (member: GroupMember) => member.userId === userLogin.id
      );
      if (isMember) {
        dispatch(
          removeUserFromGroup({ groupId: group.id, userId: userLogin.id })
        );
      } else {
        dispatch(addUserToGroup({ groupId: group.id, userId: userLogin.id }));
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Groups
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenCreateDialog(true)}
        sx={{ mb: 2 }}
      >
        Create New Group
      </Button>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : groups && groups.length > 0 ? (
        <Grid container spacing={3}>
          {groups.map((group: Group) => {
            const isMember = group.members.some(
              (member: GroupMember) => member.userId === userLogin?.id
            );
            return (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                <Card onClick={() => handleGroupClick(group.id)}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={
                        group.avatar || "https://via.placeholder.com/300x140"
                      }
                      alt={group.groupName}
                    />
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {group.groupName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Members: {group.members.length}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <Button
                    variant="contained"
                    color={isMember ? "secondary" : "primary"}
                    onClick={(e) => handleJoinLeaveGroup(e, group)}
                    sx={{ m: 1 }}
                  >
                    {isMember ? "Leave Group" : "Join Group"}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography>No groups available.</Typography>
      )}

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Group Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Groups;
