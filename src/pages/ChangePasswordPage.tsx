import React, { useEffect } from "react";
import { Form, Input, Button, message, Card, Typography } from "antd";
import { Link } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { userAtom } from "@/store/authAtoms";
import { useUpdateUser } from "@/hooks/react-query";

const { Title } = Typography;

const ChangePasswordPage: React.FC = () => {
  const [user] = useAtom(userAtom);
  const updateUser = useUpdateUser();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.data) {
      form.setFieldsValue({ name: user.data.name });
    }
  }, [user, form]);

  const onFinish = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      await updateUser.mutateAsync({
        userId: user?.data?.user_id ?? "",
        name: user?.data?.name ?? "",
        password: values.newPassword,
      });
      message.success("Password changed successfully");
      form.resetFields(["newPassword", "confirmPassword"]);
    } catch (err) {
      console.error(err);
      message.error("Failed to change password");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto p-6 shadow-md rounded-lg"
        aria-labelledby="change-password-title"
      >
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Back to Dashboard"
        >
          &larr; Back to Dashboard
        </Link>
        <Title
          level={3}
          id="change-password-title"
          className="text-center my-4"
        >
          Change Password
        </Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          <Form.Item name="name" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
            ]}
            hasFeedback
          >
            <Input.Password
              autoFocus
              aria-required="true"
              aria-label="New Password"
              placeholder="Enter your new password"
              size="large"
              className="rounded"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password
              aria-required="true"
              aria-label="Confirm New Password"
              placeholder="Re-enter your new password"
              size="large"
              className="rounded"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded"
            >
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </section>
  );
};

export default ChangePasswordPage;
