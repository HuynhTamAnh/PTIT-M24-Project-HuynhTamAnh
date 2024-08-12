// usersSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUsers } from "../../interface";
import { auth, instance, loginApi } from "../../service";

// Async thunks
export const createNewUsers: any = createAsyncThunk(
  "users/createNewUsers",
  async (data: Partial<IUsers>) => {
    const response = await instance.post("users", data);
    return response.data;
  }
);

export const createNewAvatar: any = createAsyncThunk(
  "users/avatar",
  async (data: { avatar: string }, { rejectWithValue }) => {
    // Implementation needed
  }
);

export const loginUser: any = createAsyncThunk(
  "users/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await loginApi(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser: any = createAsyncThunk(
  "users/register",
  async (data: Partial<IUsers>) => {
    const response = await instance.post("register", data);
    return response.data;
  }
);

export const autoLogin: any = createAsyncThunk("users/autoLogin", async () => {
  const userId = localStorage.getItem("user");
  const res = await auth.get(`/660/users/${userId}`);
  return res.data;
});

export const fetchUserProfile: any = createAsyncThunk(
  "users/fetchUserProfile",
  async (userId: string) => {
    const response = await instance.get(`users/${userId}`);
    return response.data;
  }
);

export const updateUserProfile: any = createAsyncThunk(
  "users/updateUserProfile",
  async (data: Partial<IUsers>) => {
    const response = await instance.patch(`users/${data.id}`, data);
    return response.data;
  }
);

export const sendFriendRequest: any = createAsyncThunk(
  "users/sendFriendRequest",
  async (data: { senderId: number; receiverId: number }, { dispatch }) => {
    const date = new Date().toISOString();
    const senderResponse = await instance.get(`users/${data.senderId}`);
    const receiverResponse = await instance.get(`users/${data.receiverId}`);
    const sender = senderResponse.data;
    const receiver = receiverResponse.data;

    const senderUpdate = {
      friends: [
        ...(sender.friends || []),
        { userId: data.receiverId, status: false, date },
      ],
    };
    const receiverUpdate = {
      friends: [
        ...(receiver.friends || []),
        { userId: data.senderId, status: false, date },
      ],
      notify: [
        ...(receiver.notify || []),
        [
          data.senderId.toString(),
          `User ${data.senderId} đã gửi lời mời kết bạn`,
          date,
        ],
      ],
    };

    await instance.patch(`users/${data.senderId}`, senderUpdate);
    const response = await instance.patch(
      `users/${data.receiverId}`,
      receiverUpdate
    );

    // Instead of dispatching fetchUserProfile, return the updated sender and receiver
    return {
      sender: { ...sender, ...senderUpdate },
      receiver: { ...receiver, ...receiverUpdate },
    };
  }
);

export const cancelFriendRequest: any = createAsyncThunk(
  "users/cancelFriendRequest",
  async (data: { senderId: number; receiverId: number }, { dispatch }) => {
    const senderResponse = await instance.get(`users/${data.senderId}`);
    const receiverResponse = await instance.get(`users/${data.receiverId}`);
    const sender = senderResponse.data;
    const receiver = receiverResponse.data;

    const senderUpdate = {
      friends: sender.friends.filter(
        (friend: any) => friend.userId !== data.receiverId
      ),
    };
    const receiverUpdate = {
      friends: receiver.friends.filter(
        (friend: any) => friend.userId !== data.senderId
      ),
      notify: receiver.notify.filter(
        (notif: any) => notif[0] !== data.senderId.toString()
      ),
    };

    await instance.patch(`users/${data.senderId}`, senderUpdate);
    const response = await instance.patch(
      `users/${data.receiverId}`,
      receiverUpdate
    );

    dispatch(fetchUserProfile(data.senderId.toString()));
    dispatch(fetchUserProfile(data.receiverId.toString()));

    return response.data;
  }
);

export const acceptFriendRequest: any = createAsyncThunk(
  "users/acceptFriendRequest",
  async (data: { accepterId: number; requesterId: number }, { dispatch }) => {
    const accepterResponse = await instance.get(`users/${data.accepterId}`);
    const requesterResponse = await instance.get(`users/${data.requesterId}`);
    const accepter = accepterResponse.data;
    const requester = requesterResponse.data;

    const date = new Date().toISOString();
    const accepterUpdate = {
      friends: accepter.friends.map((friend: any) =>
        friend.userId === data.requesterId
          ? { ...friend, status: true, date }
          : friend
      ),
      notify: accepter.notify.filter(
        (notif: any) => notif[0] !== data.requesterId.toString()
      ),
    };
    const requesterUpdate = {
      friends: requester.friends.map((friend: any) =>
        friend.userId === data.accepterId
          ? { ...friend, status: true, date }
          : friend
      ),
    };

    await instance.patch(`users/${data.accepterId}`, accepterUpdate);
    const response = await instance.patch(
      `users/${data.requesterId}`,
      requesterUpdate
    );

    dispatch(fetchUserProfile(data.accepterId.toString()));
    dispatch(fetchUserProfile(data.requesterId.toString()));

    return response.data;
  }
);
export const fetchUserFriends: any = createAsyncThunk(
  "users/fetchUserFriends",
  async (userId: number) => {
    const response = await instance.get(`users/${userId}`);
    const user = response.data;
    const friendIds =
      user.friends
        ?.filter((friend: any) => friend.status)
        .map((friend: any) => friend.userId) || [];
    const friendsPromises = friendIds.map((id: number) =>
      instance.get(`users/${id}`)
    );
    const friendsResponses = await Promise.all(friendsPromises);
    return friendsResponses.map((response) => response.data);
  }
);
export const rejectFriendRequest: any = createAsyncThunk(
  "users/rejectFriendRequest",
  async (data: { rejecterId: number; requesterId: number }, { dispatch }) => {
    const rejecterResponse = await instance.get(`users/${data.rejecterId}`);
    const rejecter = rejecterResponse.data;

    const rejecterUpdate = {
      notify: rejecter.notify.filter(
        (notif: any) => notif[0] !== data.requesterId.toString()
      ),
      friends: rejecter.friends.filter(
        (friend: any) => friend.userId !== data.requesterId || friend.status
      ),
    };

    const response = await instance.patch(
      `users/${data.rejecterId}`,
      rejecterUpdate
    );

    dispatch(fetchUserProfile(data.rejecterId.toString()));
    return response.data;
  }
);
// Slice
interface UsersState {
  users: IUsers[];
  loading: boolean;
  error: string | null;
  userLogin: IUsers | null;
  profileUser: IUsers | null;
  currentProfileFriends: IUsers[];
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  userLogin: null,
  profileUser: null,
  currentProfileFriends: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      state.userLogin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create New Users
      .addCase(createNewUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewUsers.fulfilled,
        (state, action: PayloadAction<IUsers>) => {
          state.loading = false;
          state.users.push(action.payload);
          state.error = null;
        }
      )
      .addCase(createNewUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<IUsers>) => {
          state.loading = false;
          state.users.push(action.payload);
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user.id));
        state.userLogin = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Auto Login
      .addCase(autoLogin.fulfilled, (state, action) => {
        state.userLogin = action.payload;
      })
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<IUsers>) => {
          state.loading = false;
          state.profileUser = action.payload;
          if (state.userLogin && state.userLogin.id === action.payload.id) {
            state.userLogin = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<IUsers>) => {
          state.loading = false;
          state.userLogin = action.payload;
          if (state.profileUser && state.profileUser.id === action.payload.id) {
            state.profileUser = action.payload;
          }
          state.error = null;
        }
      )
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Update the userLogin if it matches the sender
        if (
          state.userLogin &&
          state.userLogin.id === action.payload.sender.id
        ) {
          state.userLogin = action.payload.sender;
        }
        // Only update profileUser if it matches the receiver
        if (
          state.profileUser &&
          state.profileUser.id === action.payload.receiver.id
        ) {
          state.profileUser = action.payload.receiver;
        }
        state.error = null;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Cancel Friend Request
      .addCase(cancelFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFriendRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      })
      .addCase(fetchUserFriends.fulfilled, (state, action) => {
        state.currentProfileFriends = action.payload;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        if (state.userLogin) {
          state.userLogin = action.payload;
        }
        if (state.profileUser && state.profileUser.id === action.payload.id) {
          state.profileUser = action.payload;
        }
      });
  },
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;
export const { reducer } = usersSlice;
