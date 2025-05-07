import ChangePasswordPage from "@/pages/ChangePasswordPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/change-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ChangePasswordPage />;
}
