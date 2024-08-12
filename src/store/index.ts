//cấu hình store

import { configureStore } from "@reduxjs/toolkit";
import { reducer as user } from "./slices/usersSlice";
import { reducer as post } from "./slices/postsSlice";
import { reducer as friend } from "./slices/friendsSlice";
import { reducer as count } from "./slices/countSlice";
export const store: any = configureStore({
  reducer: {
    usersSlice: user,
    postsSlice: post,
    friendsSlice: friend,
    countSlice: count,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
