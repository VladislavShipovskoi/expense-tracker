import { createDomain } from "effector";

const authDomain = createDomain();

const setAuth = authDomain.createEvent<boolean>();
const setUsername = authDomain.createEvent<string>();

const $auth = authDomain
  .createStore<boolean>(false)
  .on(setAuth, (prevState, newValue) => newValue);

const $username = authDomain
  .createStore<string>("")
  .on(setUsername, (prevState, newValue) => newValue);

export { $auth, setAuth, $username, setUsername };
