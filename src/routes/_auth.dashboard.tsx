import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));

export const Route = createFileRoute("/_auth/dashboard")({
  component: DashboardPage,
});
