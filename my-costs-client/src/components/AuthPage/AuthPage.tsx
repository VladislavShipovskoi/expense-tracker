import { FC, MutableRefObject, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";
import { handleAlertMessage } from "../../utils/auth";
import { IAuthPageProps } from "../../types";
import { loginFX, registrationFX } from "../../api/authClient";
import "./styles.css";

const AuthPage: FC<IAuthPageProps> = (props: IAuthPageProps) => {
  const { type } = props;
  const [spinner, setSpinner] = useState(false);
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const navigate = useNavigate();
  const title = type === "login" ? "Log in" : "Sign up";

  const handleAuthResponse = (
    result: boolean | undefined,
    path: string,
    alertText: string,
    alertType: string
  ) => {
    if (!result) {
      return;
    }

    navigate(path);
    handleAlertMessage({ text: alertText, type: alertType });
  };

  const handleLogin = async (username: string, password: string) => {
    setSpinner(false);

    if (!username || !password) {
      handleAlertMessage({ text: "all field", type: "warning" });
      return;
    }

    const result = await loginFX({ username, password });
    handleAuthResponse(result, "/costs", "Succes login", "success");
  };

  const handleRegistration = async (username: string, password: string) => {
    setSpinner(false);

    if (!username || !password) {
      handleAlertMessage({ text: "all field", type: "warning" });
      return;
    }

    if (password.length < 4) {
      return;
    }

    const result = await registrationFX({ username, password });
    handleAuthResponse(result, "/costs", "Succes registration", "success");
  };

  const handleClickAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSpinner(true);
    switch (type) {
      case "login":
        handleLogin(usernameRef.current.value, passwordRef.current.value);
        break;
      case "registration":
        handleRegistration(
          usernameRef.current.value,
          passwordRef.current.value
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="w-50 mt-5">
        <h1>{title}</h1>
        <form onSubmit={handleClickAuth} className="form-group">
          <label className="auth-label">
            username
            <input
              type="text"
              ref={usernameRef}
              className="form-control"
              required
            />
          </label>
          <label className="auth-label">
            password
            <input
              type="password"
              ref={passwordRef}
              className="form-control"
              required
            />
          </label>

          <button className="btn btn-primary auth-btn">
            {spinner ? <Spinner /> : title}
          </button>
        </form>
        {type === "login" ? (
          <div className="auth-question-block">
            <span className="auth-question-text">No account yet?</span>
            <Link to={"/registration"}>signup</Link>
          </div>
        ) : (
          <div className="auth-question-block">
            <span className="auth-question-text">Already have an account?</span>
            <Link to={"/login"}>login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
