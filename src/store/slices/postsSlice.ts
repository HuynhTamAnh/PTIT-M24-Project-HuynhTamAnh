import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPosts, IUsers } from "../../interface";
import { instance } from "../../service";

// Async thunks
export const getNewPosts: any = createAsyncThunk<IPosts[]>(
  "posts/getNewPosts",
  async () => {
    const response = await instance.get("posts");
    return response.data;
  }
);

export const fetchUserPosts: any = createAsyncThunk<IPosts[], number>(
  "posts/fetchUserPosts",
  async (userId: number) => {
    const response = await instance.get(`users/${userId}/posts`);
    return response.data;
  }
);

export const createNewPost: any = createAsyncThunk<IPosts, Omit<IPosts, "id">>(
  "posts/createNewPost",
  async (data) => {
    const response = await instance.post("posts", {
      ...data,
      date: new Date().toISOString(),
      reactions: [],
    });
    return response.data; // Đảm bảo trả về dữ liệu từ response
  }
);

export const updatePost: any = createAsyncThunk<
  IPosts,
  { id: number; data: Partial<IPosts> }
>("posts/updatePost", async ({ id, data }) => {
  const response = await instance.patch(`posts/${id}`, data);
  return response.data;
});

export const deletePost: any = createAsyncThunk<number, number>(
  "posts/deletePost",
  async (id) => {
    await instance.delete(`posts/${id}`);
    return id;
  }
);

export type UserInfo = {
  id: number;
  name: string;
  avatar: string;
};

// Slice
interface PostsState {
  posts: IPosts[];
  userPosts: IPosts[];
  loading: boolean;
  error: string | null;
  accounts: UserInfo[];
}

const initialState: PostsState = {
  posts: [],
  userPosts: [],
  accounts: [],
  loading: false,
  error: null,
};

export const getAllUsersInfo: any = createAsyncThunk(
  "posts/getAllUsersInfo",
  async () => {
    const res = await instance.get("/users?role_like=user"); //lấy thông tin của user trừ admin
    return res.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // You can add any synchronous reducers here if needed
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get New Posts
      .addCase(getNewPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getNewPosts.fulfilled,
        (state, action: PayloadAction<IPosts[]>) => {
          state.loading = false;
          state.posts = action.payload;
          state.error = null;
        }
      )
      .addCase(getNewPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })

      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserPosts.fulfilled,
        (state, action: PayloadAction<IPosts[]>) => {
          state.loading = false;
          state.userPosts = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user posts";
      })

      // Create New Post
      .addCase(createNewPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createNewPost.fulfilled,
        (state, action: PayloadAction<IPosts>) => {
          state.loading = false;
          state.posts.unshift(action.payload);
          state.userPosts.unshift(action.payload);
          state.error = null;
        }
      )
      .addCase(createNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create post";
      })

      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<IPosts>) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        const userPostIndex = state.userPosts.findIndex(
          (post) => post.id === action.payload.id
        );
        if (userPostIndex !== -1) {
          state.userPosts[userPostIndex] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update post";
      })

      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post.id !== action.payload);
        state.userPosts = state.userPosts.filter(
          (post) => post.id !== action.payload
        );
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete post";
      })
      .addCase(getAllUsersInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersInfo.fulfilled, (state, action) => {
        state.accounts = action.payload.map((acc: IUsers) => {
          let u = {
            id: acc.id,
            name: acc.username,
            avatar: acc.avatar,
          };
          return u;
        });
      })
      .addCase(getAllUsersInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user ";
      });
  },
});

//

export const { clearError } = postsSlice.actions;
export const { reducer } = postsSlice;
