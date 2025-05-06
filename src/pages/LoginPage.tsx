import React from "react";
import LoginForm from "@/components/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <LoginForm />
    </div>
  );
};
