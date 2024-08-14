import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUsers } from "../../interface";
import { instance } from "../../service";
// let a: {id:number,name:string} = { id: 5, name: "hung" };
const initialState: {
  friendsList: IUsers[];
  isLoading: boolean;
  error: string;
} = {
  friendsList: [],
  isLoading: false,
  error: "",
};

export const getAllUsers: any = createAsyncThunk(
  "friends/getAllUsers",
  async () => {
    const response = await instance.get("users?role_like=user");
    return response.data;
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    //
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.friendsList = action.payload;
    });
  },
});
export const reducer = friendsSlice.reducer;
