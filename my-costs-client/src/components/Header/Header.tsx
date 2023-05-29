import { useTheme } from "../../hooks";
import { $auth, $username } from "../../context/auth";
import { useStore } from "effector-react";
import { removeUser } from "../../utils/auth";

export const Header = () => {
  const [theme, switchTheme] = useTheme();
  const username = useStore($username);
  const loggedIn = useStore($auth);

  return (
    <header className={`navbar bg-${theme === "dark" ? "dark" : "primary"}`}>
      <div className="container">
        <h1 className="text-white">Expense tracker</h1>

        <div className="d-flex justify-content-center">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="darkSwitch"
              checked={theme === "dark" ? true : false}
              onChange={switchTheme}
            />
            <label htmlFor={"darkSwitch"}>
              <span style={{ color: "white" }}>
                {theme === "dark" ? "Switch to light" : "Swith to dark"}
              </span>
            </label>
          </div>
        </div>

        {loggedIn ? (
          <div className="d-flex gap-3">
            <h2 style={{ color: "white" }}>{username} </h2>{" "}
            <button
              className={`btn ${
                theme === "dark" ? "btn-primary" : "btn-light"
              }`}
              onClick={removeUser}
            >
              Logout
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </header>
  );
};
