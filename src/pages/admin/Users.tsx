import React, { useEffect } from "react";
import { Table, Button, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IUsers } from "../../interface";
import {
  getAllUsers,
  updateUserProfile,
  deleteUser,
  toggleUserLock,
} from "../../store/slices/usersSlice";
import { RootState } from "../../store";

const Users: React.FC = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector(
    (state: RootState) => state.usersSlice
  );

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Account Status",
      key: "isLocked",
      render: (_: any, record: IUsers) => (
        <Switch
          checked={!record.isLocked}
          onChange={(checked) =>
            dispatch(toggleUserLock({ userId: record.id, isLocked: !checked }))
          }
          checkedChildren="Active"
          unCheckedChildren="Locked"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IUsers) => (
        <Button onClick={() => dispatch(deleteUser(record.id))}>Delete</Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Users Management</h1>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default Users;
