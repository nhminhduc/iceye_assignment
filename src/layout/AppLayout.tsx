import React, { useEffect } from "react";
import { ConfigProvider, Layout, theme as antdTheme } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { isDarkModeAtom } from "@/store/uiAtoms";
import { useAtom } from "jotai";

const { Content } = Layout;
const { defaultAlgorithm, darkAlgorithm } = antdTheme;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode] = useAtom(isDarkModeAtom);

  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const hasStored = "theme" in localStorage;
    const dark = isDarkMode || (!hasStored && systemPrefersDark);
    document.documentElement.classList.toggle("dark", dark);
  }, [isDarkMode]);
  return (
    <ConfigProvider
      theme={{ algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm }}
    >
      <Layout className="min-h-svh">
        <Sidebar />
        <Layout className="transition-margin duration-300">
          <Header />
          <Content className="p-2 transition-colors">{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
