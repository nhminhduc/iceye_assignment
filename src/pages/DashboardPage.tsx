import React from "react";
import { Spin, Alert } from "antd";
import { useAtom } from "jotai";
import { userAtom } from "@/store/authAtoms";
import AcquisitionsPanel from "@/components/AcquisitionPanel";

const DashboardPage: React.FC = () => {
  const [userQuery] = useAtom(userAtom);

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

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <main role="main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <AcquisitionsPanel />
      </main>
    </div>
  );
};

export default DashboardPage;
