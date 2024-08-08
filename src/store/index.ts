//cấu hình store

import { configureStore } from "@reduxjs/toolkit";
import { reducer as user } from "./slices/usersSlice";
import { reducer as post } from "./slices/postsSlice";

export const store: any = configureStore({
  reducer: {
    usersSlice: user,
    postsSlice: post,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
