import { useEffect, useState } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState(
    JSON.parse(localStorage.getItem("theme") as string) || "dark"
  );
  const darkTheme =
    "https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@2.0.0/dist/css/bootstrap-dark-prefers-light.min.css";
  const lightTheme =
    "https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@2.0.0/dist/css/bootstrap-light-prefers-dark.min.css";

  const setCurrentMode = (theme: string) => {
    const link = document.getElementById("theme-link") as HTMLLinkElement;
    link.href = theme === "dark" ? darkTheme : lightTheme;
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
