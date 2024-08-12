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
    return response.data;
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

export const getAllUsersInfo: any = createAsyncThunk(
  "posts/getAllUsersInfo",
  async () => {
    const res = await instance.get("/users?role_like=user");
    return res.data;
  }
);

// Thêm các thunks mới cho reactions và comments
export const addReaction: any = createAsyncThunk<
  { postId: number; userId: string },
  { postId: number; userId: number }
>("posts/addReaction", async ({ postId, userId }) => {
  const response = await instance.post(`posts/${postId}/reactions`, { userId });
  return { postId, userId: userId.toString() };
});

export const removeReaction: any = createAsyncThunk<
  { postId: number; userId: string },
  { postId: number; userId: number }
>("posts/removeReaction", async ({ postId, userId }) => {
  await instance.delete(`posts/${postId}/reactions/${userId}`);
  return { postId, userId: userId.toString() };
});

export const addComment: any = createAsyncThunk<
  {
    postId: number;
    comment: { userId: number; content: string; date: string };
  },
  { postId: number; comment: { userId: number; content: string; date: string } }
>("posts/addComment", async ({ postId, comment }) => {
  const response = await instance.post(`posts/${postId}/comments`, comment);
  return { postId, comment: response.data };
});

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

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
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

      // Get All Users Info
      .addCase(getAllUsersInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsersInfo.fulfilled, (state, action) => {
        state.accounts = action.payload.map((acc: IUsers) => ({
          id: acc.id,
          name: acc.username,
          avatar: acc.avatar,
        }));
        state.loading = false;
      })
      .addCase(getAllUsersInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user info";
      })

      // Add Reaction
      .addCase(addReaction.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post && !post.reactions.includes(userId)) {
          post.reactions.push(userId);
        }
        const userPost = state.userPosts.find((post) => post.id === postId);
        if (userPost && !userPost.reactions.includes(userId)) {
          userPost.reactions.push(userId);
        }
      })

      // Remove Reaction
      .addCase(removeReaction.fulfilled, (state, action) => {
        const { postId, userId } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post) {
          post.reactions = post.reactions.filter((id) => id !== userId);
        }
        const userPost = state.userPosts.find((post) => post.id === postId);
        if (userPost) {
          userPost.reactions = userPost.reactions.filter((id) => id !== userId);
        }
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((post) => post.id === postId);
        if (post && post.comments) {
          post.comments.push(comment);
        }
        const userPost = state.userPosts.find((post) => post.id === postId);
        if (userPost && userPost.comments) {
          userPost.comments.push(comment);
        }
      });
  },
});

export const { clearError } = postsSlice.actions;
export const { reducer } = postsSlice;
