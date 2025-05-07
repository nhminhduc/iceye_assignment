import React, { useEffect } from "react";
import { Layout, Menu, Button, Grid } from "antd";
import {
  HomeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAtom, useSetAtom } from "jotai";
import { sideMenuCollapsedAtom, isDarkModeAtom } from "@/store/uiAtoms";
import { userAtom, logoutAtom, isLoggedInAtom } from "@/store/authAtoms";
import { useNavigate, useLocation, Link } from "@tanstack/react-router";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useAtom(sideMenuCollapsedAtom);
  const [isDarkMode] = useAtom(isDarkModeAtom);
  const [userQuery] = useAtom(userAtom);
  const logout = useSetAtom(logoutAtom);
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  const [isLoggedIn] = useAtom(isLoggedInAtom);

  useEffect(() => {
    setCollapsed(!screens.lg);
  }, [screens.lg, setCollapsed]);

  if (!isLoggedIn) {
    return null;
  }

  const name = userQuery.data?.name ?? "User";
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const menuItems = [
    { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
    {
      key: "Profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={200}
      collapsedWidth={80}
      theme={isDarkMode ? "dark" : "light"}
      aria-label="Sidebar navigation"
    >
      <div className="h-16 flex items-center justify-center mb-6 p-2">
        <Link to="/dashboard">
          {collapsed ? (
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              L
            </span>
          ) : (
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Larvis
            </span>
          )}
        </Link>
      </div>

      <div
        className="flex items-center justify-between px-6 py-2 mb-4"
        title={collapsed ? name : `Hello, ${name}`}
      >
        {!collapsed && (
          <span className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
            Hello, {name}
          </span>
        )}
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          aria-label="Logout"
        />
      </div>

      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        inlineCollapsed={collapsed}
        selectedKeys={[location.pathname.replace("/dashboard", "")]}
        onClick={({ key }) => navigate({ to: `/${key}` })}
        items={menuItems}
      />

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 self-end">
        <Button
          type="text"
          onClick={() => setCollapsed(!collapsed)}
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
