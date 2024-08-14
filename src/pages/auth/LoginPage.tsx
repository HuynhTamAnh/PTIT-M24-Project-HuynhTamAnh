import React from "react";
import { Form, Input, Button, Checkbox, Typography, Card, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { loginUser } from "../../store/slices/usersSlice";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(
    (state: RootState) => state.usersSlice
  );

  const onFinish = async (values: LoginFormValues) => {
    try {
      const result = await dispatch(
        loginUser({ email: values.email, password: values.password })
      ).unwrap();
      console.log("Login result:", result);

      if (result.user.isLocked) {
        message.error(
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
        );
        return;
      }

      message.success("Đăng nhập thành công!");
      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (
        error.message ===
        "This account has been locked. Please contact an administrator."
      ) {
        message.error(
          "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
        );
      } else {
        message.error("Sai email hoặc mật khẩu!");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-midnight">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl bg-white">
          <Title level={2} style={{ color: "lightblue" }}>
            Đăng nhập
          </Title>
          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Email!",
                  type: "email",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Mật khẩu"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: "lightblue" }}>
                  Ghi nhớ đăng nhập
                </Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="float-right">
                Quên mật khẩu
              </Link>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          {error && <Text type="danger">{error}</Text>}
          <Text
            className="block mt-4 text-gray-600"
            style={{ color: "lightblue" }}
          >
            <InfoCircleOutlined className="mr-1" />
            Bằng cách đăng nhập, bạn đồng ý với các điều khoản và điều kiện của
            chúng tôi.
          </Text>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <Link to="/register" className="text-blue-600">
              Đăng ký ngay
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
