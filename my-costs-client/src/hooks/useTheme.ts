import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme") as string) || "dark"
  );

  const setCurrentMode = (theme: string) => {
    const link = document.getElementById("theme-link") as HTMLLinkElement;
    link.dataset.bsTheme = theme === "dark" ? "dark" : "light";
  };

  const inverseMode = theme === "dark" ? "light" : "dark";
  const switchTheme = () => {
    localStorage.setItem("theme", JSON.stringify(inverseMode));
    setCurrentMode(theme);

    setTheme(inverseMode);
  };

  useEffect(() => {
    setCurrentMode(theme);
  }, [theme]);

  return [theme, switchTheme];
};

export { useTheme };
