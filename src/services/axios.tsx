import axios from "axios";
import { showErrorToast } from "./toast";

export const APP_VERSION = "0.0.1";
document.title = "Admin | ICB Network App " + APP_VERSION;

var BASE_URL = import.meta.env.VITE_BASE_URL || "https://dapps-api.icb.network";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || "";
    if (token) config.headers.Authorization = token;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.setItem("authToken", "");
      window.location.href = "/auth/login";
    }
    let msg = "";
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message;
    } else {
      msg = "Unexpected Error:";
    }
    if (typeof msg === "object") {
      try {
        const firstField = Object.keys(msg)[0];
        msg = msg[firstField][0];
      } catch (error) {}
    }
    showErrorToast(msg);
    return Promise.reject(error);
  }
);

export { api };
