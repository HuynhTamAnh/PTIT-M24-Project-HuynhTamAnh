import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Group, GroupPost, GroupMember } from "../../interface";
import { instance } from "../../service";
import { RootState } from "../../store";

// Async Thunks
export const allGroups: any = createAsyncThunk("groups/allGroups", async () => {
  const response = await instance.get<Group[]>("groups");
  return response.data;
});

export const getGroupById: any = createAsyncThunk(
  "groups/getGroupById",
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await instance.get<Group>(`groups/${groupId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const createGroup: any = createAsyncThunk(
  "groups/createGroup",
  async (data: Omit<Group, "id">, { rejectWithValue }) => {
    try {
      const response = await instance.post<Group>("groups", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const updateGroupInfo: any = createAsyncThunk(
  "groups/updateGroupInfo",
  async (
    { groupId, data }: { groupId: number; data: Partial<Group> },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.patch<Group>(`groups/${groupId}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const addUserToGroup: any = createAsyncThunk(
  "groups/addUserToGroup",
  async (
    { groupId, userId }: { groupId: number; userId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const group = state.groupsSlice.groups.find(
        (g: Group) => g.id === groupId
      );
      if (!group) throw new Error("Group not found");

      const newMember: GroupMember = {
        userId,
        role: false,
        dateJoin: new Date().toISOString(),
      };

      const updatedMembers = [...group.members, newMember];
      const response = await instance.patch<Group>(`groups/${groupId}`, {
        members: updatedMembers,
      });
      return { groupId, updatedGroup: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const removeUserFromGroup: any = createAsyncThunk(
  "groups/removeUserFromGroup",
  async (
    { groupId, userId }: { groupId: number; userId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const group = state.groupsSlice.groups.find(
        (g: Group) => g.id === groupId
      );
      if (!group) throw new Error("Group not found");

      const updatedMembers = group.members.filter(
        (member: GroupMember) => member.userId !== userId
      );
      const response = await instance.patch<Group>(`groups/${groupId}`, {
        members: updatedMembers,
      });
      return { groupId, updatedGroup: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const createGroupPost: any = createAsyncThunk(
  "groups/createGroupPost",
  async (
    {
      groupId,
      postData,
    }: { groupId: number; postData: Omit<GroupPost, "idPostGroup" | "dateat"> },
    { getState, rejectWithValue }
  ) => {
    try {
      const state: RootState = getState() as RootState;
      console.log(state.groupsSlice.groups);

      const group = state.groupsSlice.groups.find((g: any) => g.id === groupId);
      console.log(group);

      if (!group) {
        throw new Error("Group not found");
      }

      const newPost: GroupPost = {
        idPostGroup: Date.now(), // Tạo một ID duy nhất
        ...postData,
        dateat: new Date().toISOString(),
      };

      const updatedPostGroup = [...(group.postGroup || []), newPost];

      const response = await instance.patch(`groups/${groupId}`, {
        postGroup: updatedPostGroup,
      });

      // Trả về dữ liệu mới, giả định rằng server trả về group đã được cập nhật
      return { groupId, post: newPost, updatedGroup: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const fetchUserById: any = createAsyncThunk(
  "users/fetchUserById",
  async (userId: number, thunkAPI) => {
    try {
      const response = await instance.get(
        `http://localhost:3000/users/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to fetch user");
    }
  }
);

export const updateGroupAvatar: any = createAsyncThunk(
  "groups/updateGroupAvatar",
  async (
    { groupId, avatar }: { groupId: number; avatar: FormData },
    thunkAPI
  ) => {
    try {
      const response = await instance.patch(
        `groups/${groupId}/avatar`,
        avatar,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Chuyển đổi dữ liệu nếu cần
      const avatarUrl =
        typeof response.data.avatar === "string"
          ? response.data.avatar
          : response.data.avatar.url;
      return { ...response.data, avatar: avatarUrl };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to update group avatar");
    }
  }
);

export const updateGroupPost: any = createAsyncThunk(
  "groups/updateGroupPost",
  async (
    {
      groupId,
      postId,
      updatedPost,
    }: { groupId: number; postId: number; updatedPost: GroupPost },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const group = state.groupsSlice.groups.find(
        (g: Group) => g.id === groupId
      );
      if (!group) throw new Error("Group not found");

      const updatedPostGroup = group.postGroup.map((post: GroupPost) =>
        post.idPostGroup === postId ? updatedPost : post
      );

      const response = await instance.patch(`groups/${groupId}`, {
        postGroup: updatedPostGroup,
      });

      return { groupId, updatedGroup: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const deleteGroupPost: any = createAsyncThunk(
  "groups/deleteGroupPost",
  async (
    { groupId, postId }: { groupId: number; postId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const group = state.groupsSlice.groups.find(
        (g: Group) => g.id === groupId
      );
      if (!group) throw new Error("Group not found");

      const updatedPostGroup = group.postGroup.filter(
        (post: GroupPost) => post.idPostGroup !== postId
      );

      const response = await instance.patch(`groups/${groupId}`, {
        postGroup: updatedPostGroup,
      });

      return { groupId, updatedGroup: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
export const deleteGroup: any = createAsyncThunk(
  "groups/deleteGroup",
  async (
    { groupId, userId }: { groupId: number; userId: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const group = state.groupsSlice.groups.find(
        (g: Group) => g.id === groupId
      );

      if (!group) {
        throw new Error("Group not found");
      }

      const isAdmin = group.members.some(
        (member: GroupMember) =>
          member.userId === userId && member.role === true
      );

      if (!isAdmin) {
        throw new Error("User does not have permission to delete this group");
      }

      await instance.delete(`groups/${groupId}`);

      return groupId;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting the group"
      );
    }
  }
);
export const lockGroup: any = createAsyncThunk(
  "groups/lockGroup",
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`groups/${groupId}`, {
        isLocked: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);

export const unlockGroup: any = createAsyncThunk(
  "groups/unlockGroup",
  async (groupId: number, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`groups/${groupId}`, {
        isLocked: false,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "An error occurred");
    }
  }
);
// Slice
interface GroupsState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearCurrentGroup: (state) => {
      state.currentGroup = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(allGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(allGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(allGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch groups";
      })
      .addCase(getGroupById.fulfilled, (state, action) => {
        state.currentGroup = action.payload;
      })
      .addCase(
        createGroupPost.fulfilled,
        (
          state,
          action: PayloadAction<{
            groupId: number;
            post: GroupPost;
            updatedGroup: Group;
          }>
        ) => {
          const { groupId, updatedGroup } = action.payload;

          // Cập nhật group trong danh sách groups
          const groupIndex = state.groups.findIndex((g) => g.id === groupId);
          if (groupIndex !== -1) {
            state.groups[groupIndex] = updatedGroup;
          }

          // Cập nhật currentGroup nếu đang xem group này
          if (state.currentGroup && state.currentGroup.id === groupId) {
            state.currentGroup = updatedGroup;
          }
        }
      )
      .addCase(updateGroupInfo.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
        if (state.currentGroup && state.currentGroup.id === action.payload.id) {
          state.currentGroup = action.payload;
        }
      })
      .addCase(addUserToGroup.fulfilled, (state, action) => {
        const { groupId, updatedGroup } = action.payload;
        const index = state.groups.findIndex((g) => g.id === groupId);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        if (state.currentGroup && state.currentGroup.id === groupId) {
          state.currentGroup = updatedGroup;
        }
      })
      .addCase(removeUserFromGroup.fulfilled, (state, action) => {
        const { groupId, updatedGroup } = action.payload;
        const index = state.groups.findIndex((g) => g.id === groupId);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        if (state.currentGroup && state.currentGroup.id === groupId) {
          state.currentGroup = updatedGroup;
        }
      })
      .addCase(updateGroupPost.fulfilled, (state, action) => {
        const { groupId, updatedGroup } = action.payload;
        const index = state.groups.findIndex((g) => g.id === groupId);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        if (state.currentGroup && state.currentGroup.id === groupId) {
          state.currentGroup = updatedGroup;
        }
      })
      .addCase(deleteGroupPost.fulfilled, (state, action) => {
        const { groupId, updatedGroup } = action.payload;
        const index = state.groups.findIndex((g) => g.id === groupId);
        if (index !== -1) {
          state.groups[index] = updatedGroup;
        }
        if (state.currentGroup && state.currentGroup.id === groupId) {
          state.currentGroup = updatedGroup;
        }
      }) // Trong groupsSlice.ts
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(updateGroupAvatar.fulfilled, (state, action) => {
        console.log("Update avatar response:", action.payload);
        if (state.currentGroup && state.currentGroup.id === action.payload.id) {
          state.currentGroup.avatar = action.payload.avatar;
        }
        const index = state.groups.findIndex(
          (group) => group.id === action.payload.id
        );
        if (index !== -1) {
          state.groups[index].avatar = action.payload.avatar;
        }
      })
      .addCase(deleteGroup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = state.groups.filter(
          (group) => group.id !== action.payload
        );
        if (state.currentGroup && state.currentGroup.id === action.payload) {
          state.currentGroup = null;
        }
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(lockGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = { ...state.groups[index], isLocked: true };
        }
      })
      .addCase(unlockGroup.fulfilled, (state, action) => {
        const index = state.groups.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = { ...state.groups[index], isLocked: false };
        }
      });
  },
});

export const { clearCurrentGroup, clearError } = groupsSlice.actions;
export default groupsSlice.reducer;
export const { reducer } = groupsSlice;
