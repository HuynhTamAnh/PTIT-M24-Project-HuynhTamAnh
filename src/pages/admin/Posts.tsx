import React, { useEffect } from "react";
import { Table, Button, Spin } from "antd";
import { IPosts } from "../../interface";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserPosts, deletePost } from "../../store/slices/postsSlice";
import { RootState } from "../../store";

const Posts: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.postsSlice
  );
  // console.log(posts);
  useEffect(() => {
    dispatch(fetchUserPosts()); // Fetch posts for user with ID 1 (adjust as needed)
  }, []);

  const handleDeletePost = (postId: number) => {
    dispatch(deletePost(postId));
  };

  const columns = [
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "User ID",
      dataIndex: "userId",
      key: "userId",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Privacy",
      dataIndex: "privacy",
      key: "privacy",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IPosts) => (
        <Button onClick={() => handleDeletePost(record.id)} danger>
          Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Posts Management</h1>
      <Table columns={columns} dataSource={posts} rowKey="id" />
    </div>
  );
};

export default Posts;
