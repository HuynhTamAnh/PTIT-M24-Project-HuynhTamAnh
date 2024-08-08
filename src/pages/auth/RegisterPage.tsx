import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Steps, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { createNewUsers } from "../../store/slices/usersSlice";

const { Title, Text } = Typography;
const { Step } = Steps;

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const RegisterPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<RegisterFormValues>();

  const dispatch = useDispatch();

  const onFinish = async (values: RegisterFormValues) => {
    const newUser = {
      username: formValues?.username,
      email: formValues?.email,
      password: formValues?.password,
      phone: values.phone,
    };

    setLoading(true);
    dispatch(createNewUsers(newUser));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    message.success("Đăng ký thành công!");
    setLoading(false);
    navigate("/login");
  };

  const nextStep = () => {
    setFormValues((pre) => ({ ...pre, ...form.getFieldsValue() }));
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((info) => {});
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Thông tin cơ bản",
      content: (
        <>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên đăng nhập!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Mật khẩu",
      content: (
        <>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự!" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Thông tin bổ sung",
      content: (
        <Form.Item
          name="phone"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
        </Form.Item>
      ),
    },
  ];

  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl bg-white">
          <div className="flex justify-between items-center mb-4">
            <Title level={2}>Đăng ký</Title>
          </div>
          <Steps current={currentStep} className="mb-8">
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
          >
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              {steps[currentStep].content}
            </motion.div>
            <Form.Item>
              {currentStep < steps.length - 1 && (
                <Button type="primary" onClick={nextStep} className="mr-2">
                  Tiếp theo
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="primary" htmlType="submit" loading={loading}>
                  Đăng ký
                </Button>
              )}
              {currentStep > 0 && (
                <Button onClick={prevStep} style={{ marginLeft: 8 }}>
                  Quay lại
                </Button>
              )}
            </Form.Item>
          </Form>
          <Text className="block mt-4 text-gray-600">
            <InfoCircleOutlined className="mr-1" />
            Bằng cách đăng ký, bạn đồng ý với các điều khoản và điều kiện của
            chúng tôi.
          </Text>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-600">
              Đã có tài khoản? Đăng nhập
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
