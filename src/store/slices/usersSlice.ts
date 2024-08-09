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

// Slice
interface UsersState {
  users: IUsers[];
  loading: boolean;
  error: string | null;
  userLogin: IUsers | null;
  profileUser: IUsers | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  userLogin: null,
  profileUser: null,
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
        state.userLogin = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
          password: "",
          avatar: action.payload.avatar,
          phone: action.payload.phone,
          role: action.payload.role,
          follower: action.payload.follower,
          following: action.payload.following,
          friends: action.payload.friends,
        };
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
      });
  },
});

export const { logout } = usersSlice.actions;
export const reducer = usersSlice.reducer;
