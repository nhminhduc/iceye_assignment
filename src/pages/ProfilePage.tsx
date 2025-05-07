import React, { useEffect } from "react";
import { Card, Form, Input, Button, message, Divider } from "antd";
import type { UpdateUserPayload } from "@/types/api";
import { useUpdateUser } from "@/hooks/react-query";
import { userAtom } from "@/store/authAtoms";
import { useAtom } from "jotai";

const ProfilePage: React.FC = () => {
  const [user] = useAtom(userAtom);
  const { mutateAsync, status: updateStatus } = useUpdateUser();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.data) {
      form.setFieldsValue({ name: user.data.name });
    }
  }, [user, form]);

  const onFinish = async (values: {
    name: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    if (!user?.data) return;

    const payload: UpdateUserPayload = {
      userId: user.data.user_id,
      name: values.name,
    };
    if (values.currentPassword && values.newPassword) {
      payload.password = values.newPassword;
    }

    try {
      await mutateAsync(payload);
      message.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      message.error((err as Error).message || "Update failed");
    }
  };

  if (!user?.data) return null;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card
        title="Profile Settings"
        className="shadow-md"
        extra={
          <span className="text-gray-500">User ID: {user.data.user_id}</span>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ name: user.data.name }}
          className="space-y-6"
        >
          <Form.Item
            label="Display Name"
            name="name"
            rules={[
              { required: true, message: "Please input your name" },
              { min: 2, message: "Name must be at least 2 characters" },
            ]}
          >
            <Input placeholder="Your display name" />
          </Form.Item>

          <Divider>Change Password</Divider>

          <Form.Item
            label="Current Password"
            name="currentPassword"
            dependencies={["newPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const newPwd = getFieldValue("newPassword");
                  if (!value && !newPwd) return Promise.resolve();
                  if (value && newPwd) return Promise.resolve();
                  return Promise.reject(
                    new Error("Both current and new password are required")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            dependencies={["currentPassword"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const current = getFieldValue("currentPassword");
                  if (!value && !current) return Promise.resolve();
                  if (value && value.length < 4)
                    return Promise.reject(
                      new Error("Password must be at least 4 characters")
                    );
                  if (current && value) return Promise.resolve();
                  return Promise.reject(
                    new Error("Both current and new password are required")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateStatus === "pending"}
              className="w-full md:w-auto"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
