import { FiSun, FiMoon } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div onClick={toggleTheme} className="mt-1 text-gray-500 cursor-pointer">
      {theme === "dark" ? (
        <FiSun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <FiMoon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
