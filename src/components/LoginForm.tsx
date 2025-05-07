import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, message, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useSetAtom } from "jotai";
import { loginAtom } from "@/store/authAtoms";
import { useNavigate } from "@tanstack/react-router";

const { Title, Text } = Typography;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const login = useSetAtom(loginAtom);
  const navigate = useNavigate({ from: "/login" });

  // Get redirect target from query string (default to home)
  const params = new URLSearchParams(window.location.search);
  const redirectUrl = params.get("redirect") || "/dashboard";

  const onFinish = async (values: {
    userId: string;
    password: string;
    remember: boolean;
  }) => {
    setLoading(true);
    try {
      await login({ userId: values.userId, password: values.password });
      message.success("Welcome!");
      // Navigate to original destination or home, replacing history
      navigate({ to: redirectUrl, replace: true });
    } catch (err: any) {
      console.error("Login failed", err);
      message.error(err.message || "Login failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card
        className="w-full max-w-sm shadow-xl rounded-lg p-8"
        aria-labelledby="login-title"
      >
        <header className="mb-6 text-center">
          <Title id="login-title" level={2} className="text-blue-700">
            Sign In
          </Title>
          <Text type="secondary">Access your account</Text>
        </header>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          requiredMark={false}
          className="space-y-4"
        >
          <Form.Item
            label="Username"
            name="userId"
            rules={[{ required: true, message: "Please enter your username" }]}
            hasFeedback
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              size="large"
              aria-label="Username"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
              aria-label="Password"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
