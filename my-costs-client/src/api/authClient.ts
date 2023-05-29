import { createEffect } from "effector";
import { setAuth, setUsername } from "../context";
import { IAuth } from "../types";
import api from "./axiosClient";
import { AxiosError } from "axios";
import { handleAxiosError } from "./costsClient";

const loginFX = createEffect(async ({ username, password }: IAuth) => {
  try {
    const result = await api.post("/auth/login", {
      username,
      password,
    });

    if (result.status === 200) {
      setAuth(true);
      setUsername(result.data.username);
      localStorage.setItem("auth", JSON.stringify(result.data));
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
});

const registrationFX = createEffect(async ({ username, password }: IAuth) => {
  try {
    const result = await api.post("/auth/registration", {
      username,
      password,
    });

    if (result.status === 201) {
      setAuth(false);
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error as AxiosError);
  }
});

export { loginFX, registrationFX };
