import axios from "axios";
import { showErrorToast } from "./toast";
import { ethers } from "ethers";

export const APP_VERSION = "0.0.1";
document.title = "Admin | ICB Network App " + APP_VERSION;

var BASE_URL = import.meta.env.VITE_BASE_URL || "https://dapps-api.icb.network";

export var ICB_SCAN = "";

const abi = [
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "blackList",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "addressToTokenId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

export let provider: ethers.JsonRpcProvider;
export let icbKycNFTContract: ethers.Contract;

export const setBasicConfig = async () => {
  await api.get("api/public/admin/config").then((res) => {
    ICB_SCAN = res.data.scan;
    provider = new ethers.JsonRpcProvider(res.data.rpc);
    icbKycNFTContract = new ethers.Contract(res.data.icbkyc, abi, provider);
  });
  if (!sessionStorage.getItem("statusId"))
    api.get("api/app/admin/status").then((res) => {
      sessionStorage.setItem("statusId", res.data.id);
    });
};

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
