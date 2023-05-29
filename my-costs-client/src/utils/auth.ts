import { setAlert } from "../context/alert";
import { setAuth, setUsername } from "../context/auth";
import { IAlert } from "../types";

const handleAlertMessage = (alert: IAlert) => {
  setAlert(alert);
  setTimeout(() => {
    setAlert({ text: "", type: "" });
  }, 3000);
};

const removeUser = () => {
  localStorage.removeItem("auth");
  setAuth(false);
  setUsername("");
};

const getAuthDataFromLocalStorage = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") as string);

    if (!auth) {
      removeUser();
      return;
    }

    return auth;
  } catch (error) {
    removeUser();
  }
};

export { getAuthDataFromLocalStorage, removeUser, handleAlertMessage };
