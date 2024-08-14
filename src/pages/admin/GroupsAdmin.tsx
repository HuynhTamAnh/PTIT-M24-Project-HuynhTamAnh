import React, { useEffect } from "react";
import { Table, Switch, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  allGroups,
  lockGroup,
  unlockGroup,
} from "../../store/slices/groupsSlice";
import { Group } from "../../interface";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";

const GroupsAdmin: React.FC = () => {
  const dispatch = useDispatch();
  const { groups, isLoading } = useSelector(
    (state: RootState) => state.groupsSlice
  );

  useEffect(() => {
    dispatch(allGroups());
  }, [dispatch]);

  const handleLockChange = (groupId: number, currentLockStatus: boolean) => {
    if (currentLockStatus) {
      dispatch(lockGroup(groupId))
        .unwrap()
        .then(() => {
          notification.success({
            message: `Group ${groupId} locked`,
            description: `The group has been locked.`,
          });
        })
        .catch((error: any) => {
          notification.error({
            message: `Failed to lock group ${groupId}`,
            description: error.message || "An error occurred",
          });
        });
    } else {
      dispatch(unlockGroup(groupId))
        .unwrap()
        .then(() => {
          notification.success({
            message: `Group ${groupId} unlocked`,
            description: `The group has been unlocked.`,
          });
        })
        .catch((error: any) => {
          notification.error({
            message: `Failed to unlock group ${groupId}`,
            description: error.message || "An error occurred",
          });
        });
    }
  };
  const columns = [
    {
      title: "Group Name",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "Date Created",
      dataIndex: "dateAt",
      key: "dateAt",
    },
    {
      title: "Members Count",
      key: "membersCount",
      render: (_: any, record: Group) => record.members.length,
    },
    {
      title: "Lock Status",
      key: "isLocked",
      render: (_: any, record: Group) => (
        <Switch
          checkedChildren={<UnlockOutlined />}
          unCheckedChildren={<LockOutlined />}
          checked={!record.isLocked}
          onChange={() => handleLockChange(record.id, !record.isLocked)}
        />
      ),
    },
  ];

  return (
    <div>
      <h1>Groups Management</h1>
      <Table
        columns={columns}
        dataSource={groups}
        rowKey="id"
        loading={isLoading}
      />
    </div>
  );
};

export default GroupsAdmin;
