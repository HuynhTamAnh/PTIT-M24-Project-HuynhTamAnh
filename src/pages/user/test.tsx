import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDispatch } from "react-redux";
import { increment } from "../../store/slices/countSlice";

const Test = () => {
  let a = 10;
  const changeA = () => {
    a += 30;
    console.log(a);
  };
  const dispatch = useDispatch();
  const incrementN = () => {
    dispatch(increment(10));
  };
  const { count } = useSelector((state: RootState) => state.countSlice);
  console.log(increment(10));
  return (
    <div>
      <button onClick={incrementN}>Change a</button>
      <p>{count}</p>

      {/* <p>{a}</p> */}
    </div>
  );
};

export default Test;
