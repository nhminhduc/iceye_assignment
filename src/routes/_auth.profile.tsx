import { createFileRoute } from "@tanstack/react-router";
import React from "react";

const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
});
