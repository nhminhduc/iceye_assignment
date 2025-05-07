import AppLayout from "@/layout/AppLayout";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

interface MyRouterContext {
  isLoggedIn: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <TanStackRouterDevtools />
    </>
  ),
});
