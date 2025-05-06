import React from "react";
import { Button, Spin, Alert, Space } from "antd";
import { useAtom, useSetAtom } from "jotai";
import { Link, useNavigate } from "@tanstack/react-router";
import { logoutAtom, userAtom } from "@/store/authAtoms";
import AcquisitionsPanel from "@/components/AcquisitionPanel";

const IndexPage: React.FC = () => {
  const logout = useSetAtom(logoutAtom);
  const [userQuery] = useAtom(userAtom);
  const navigate = useNavigate({ from: "/" });

  if (userQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Spin tip="Loading user…" size="large" />
      </div>
    );
  }
  if (userQuery.isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
        <Alert
          type="error"
          message="Failed to load user profile"
          className="w-full max-w-sm"
        />
      </div>
    );
  }

  const name = userQuery.data?.name ?? "User";

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center sm:justify-between">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-600">
              Welcome back, <span className="font-medium">{name}</span>!
            </p>
          </div>
          <nav aria-label="User actions">
            <Space
              direction="vertical"
              size="small"
              className="w-full sm:w-auto sm:flex sm:flex-row sm:space-x-4"
            >
              <Link
                to="/change-password"
                className="block text-center text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded p-2"
                aria-label="Change password"
              >
                Change Password
              </Link>
              <Button
                type="default"
                danger
                onClick={handleLogout}
                className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 p-2"
                aria-label="Logout"
              >
                Logout
              </Button>
            </Space>
          </nav>
        </div>
      </header>

      <main
        role="main"
        className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <AcquisitionsPanel />
      </main>
    </div>
  );
};

export default IndexPage;
