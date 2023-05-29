import { createDomain } from "effector";
import { IAlert } from "../types";

const error = createDomain();
const setAlert = error.createEvent<IAlert>();
const $alert = error
  .createStore<IAlert>({ text: "", type: "" })
  .on(setAlert, (_, value) => value);

export { $alert, setAlert };
