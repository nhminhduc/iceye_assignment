import { isDarkModeAtom } from "@/store/uiAtoms";
import { Layout, Switch } from "antd";
import { useAtom } from "jotai";

const { Header: AntdHeader } = Layout;

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useAtom(isDarkModeAtom);

  return (
    <AntdHeader
      className="flex items-center justify-end px-4 shadow-sm"
      role="banner"
    >
      <Switch
        checkedChildren="🌙"
        unCheckedChildren="☀️"
        checked={isDarkMode}
        onChange={(checked) => setIsDarkMode(checked)}
        aria-label="Toggle dark/light mode"
      />
    </AntdHeader>
  );
};

export default Header;
