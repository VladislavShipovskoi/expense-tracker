import { useTheme } from "../../hooks/index";
import "./styles.css";

export const Header = () => {
  const [theme, switchTheme] = useTheme();
  return (
    <header
      className={`navbar navbar-dark bg-${
        theme === "dark" ? "dark" : "primary"
      }`}
    >
      <div className="container">
        <h1 className="title">My Costs</h1>
        <button
          onClick={switchTheme}
          className={`btn btn-${
            theme === "dark" ? "light" : "dark"
          } switchThemeButton`}
        >
          {theme === "dark" ? "Switch to light" : "Swith to dark"}
        </button>
      </div>
    </header>
  );
};
