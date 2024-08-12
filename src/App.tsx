import React, { useEffect, useState } from "react";

// import LoginPage from "../pages/auth/LoginPage";
// import RegisterPage from "../pages/auth/RegisterPage";
import "./App.css";
// import "antd/dist/antd.css";
import Router from "./router/index";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Nav from "./pages/user/LeftSider";
import { instance } from "./service";
import axios from "axios";
import Test from "./pages/user/test";
import { increment } from "./store/slices/countSlice";
const App: React.FC = () => {
  // const [count, setCount] = useState(1);
  // console.log(increment(10));
  return <Router>ggggg</Router>;
  return <Test />;
};

export default App;
