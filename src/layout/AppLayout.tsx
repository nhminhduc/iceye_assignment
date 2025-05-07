import React, { useEffect } from "react";
import { ConfigProvider, Layout, theme as antdTheme } from "antd";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { isDarkModeAtom } from "@/store/uiAtoms";
import { useAtom } from "jotai";
import clsx from "clsx";

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
      <Layout className="h-screen overflow-hidden">
        <Sidebar />
        <Layout
          className={clsx("h-full overflow-hidden transition-all duration-300")}
        >
          <Header />
          <Content className="h-full overflow-auto bg-gray-50 dark:bg-gray-800 transition-colors">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;
