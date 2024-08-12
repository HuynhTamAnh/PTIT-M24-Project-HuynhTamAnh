import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { reducer } from "./usersSlice";

const countSlice = createSlice({
  //giá trị khởi tạo
  name: "count",
  initialState: {
    count: 0,
  },
  //reducer
  reducers: {
    increment(state, action: PayloadAction<number>) {
      state.count += action.payload;
    },
    decrement(state, action: PayloadAction<number>) {
      state.count -= action.payload;
    },
  },
  extraReducers: () => {
    //
  },
});
export const { increment } = countSlice.actions;
//tạo hàm act_incrementN có 1 tham số n
//trả về 1 object có 1 thuộc tính tên type và giá trị là chuỗi action/incrementToN và 1 thuộc tính payload có giá trị là giá trị n truyền vào hàm
// const act_incrementN = (n: number) => ({
//   type: "action/incrementToN",
//   payload: n,
// });

// act_incrementN(10);
export const reducer = countSlice.reducer;
