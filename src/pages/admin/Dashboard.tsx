import React, { useEffect } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getAllUsers } from "../../store/slices/usersSlice";
import { getNewPosts } from "../../store/slices/postsSlice";
import { allGroups } from "../../store/slices/groupsSlice";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state: RootState) => state.usersSlice);
  const { posts } = useSelector((state: RootState) => state.postsSlice);
  const { groups } = useSelector((state: RootState) => state.groupsSlice);

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getNewPosts());
    dispatch(allGroups());
  }, [dispatch]);

  const cardStyle = {
    background: "#000",
    color: "white",
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card style={cardStyle}>
            <Statistic
              title="Total Users"
              value={users.length}
              valueStyle={{ color: "white" }}
              titleStyle={{ color: "white" }} // Uncommented and ensured titleStyle is white
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={cardStyle}>
            <Statistic
              title="Total Posts"
              value={posts.length}
              valueStyle={{ color: "white" }}
              //   titleStyle={{ color: "white" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={cardStyle}>
            <Statistic
              title="Total Groups"
              value={groups.length}
              valueStyle={{ color: "white" }}
              //   titleStyle={{ color: "white" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
