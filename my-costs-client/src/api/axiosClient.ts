import axios from "axios";

const instanceAxios = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
});

export default instanceAxios;
