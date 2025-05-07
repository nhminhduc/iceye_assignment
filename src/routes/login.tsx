import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const LoginPage = React.lazy(() => import("@/pages/LoginPage"));

export const Route = createFileRoute("/login")({
  component: LoginPage,
});
