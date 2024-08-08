import React from "react";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { RootState } from "../../store";
import { IUsers } from "../../interface";
import ContentPosts from "./ContentPosts";
import RightSider from "./RightSider";

const HomeContent: React.FC = () => {
  const userLogin = useSelector(
    (state: RootState) => state.usersSlice.userLogin
  ) as IUsers | null;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <ContentPosts />
      </Grid>
      <Grid item xs={12} md={4}>
        <RightSider userLogin={userLogin} />
      </Grid>
    </Grid>
  );
};

export default HomeContent;
