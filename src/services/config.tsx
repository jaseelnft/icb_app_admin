import axios from "axios";
import { showErrorToast } from "./toast";
import { ethers } from "ethers";
import { clearAllRedux, setChats, store } from "../redux/store";
import { io, Socket } from "socket.io-client";
import { getSupportMsgs } from "./support";

export const APP_VERSION = "0.0.1";
document.title = "Admin | ICB Network App " + APP_VERSION;

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "https://dapps-api.icb.network";
const BASE_WS = import.meta.env.VITE_BASE_WS;

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

  const id = localStorage.getItem("accesLogId") ?? "";
  const host = window.location.hostname ?? "";
  api
    .get(`api/app/users/status?id=${id}&host=${host}`)
    .then((res) => localStorage.setItem("accesLogId", res.data.id))
    .catch();
};

export const api = axios.create({
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
      appLogOut();
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

let socket: Socket<any>;

export const appLogOut = () => {
  localStorage.setItem("authToken", "");
  clearAllRedux();
  socket.disconnect();
};

export const appLogIn = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const connectWs = () => {
  const token = localStorage.getItem("authToken") || "";
  const auth = { from: "ADMIN", token };
  socket = io(BASE_WS, { transports: ["websocket"], auth });
  // socket.on("connect", () => {});

  socket.on("message", (data: any) => {
    if (data.type === "MSG") {
      showSupportNotification("Message On support", "hallow World");
      store.dispatch(setChats(data.chats));
      const chat: any = store.getState().app.chat;
      if (chat && !chat.empty && chat._id === data.chatId)
        getSupportMsgs(data.chatId);
    } else if (data.type === "REG") {
      store.dispatch(setChats(data.chats));
    }
  });
};

export const sendWSMSG = async (chatId: string, msg: string) => {
  if (socket && socket.connected) {
    const payload = { msg, from: "ADMIN", chatId };
    socket.emit("message", payload);
  } else {
    connectWs();
  }
};

function showSupportNotification(title: string, _body: string) {
  // check if user is NOT on /support page
  if (!window.location.pathname.includes("/support")) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: "You got a reply from Support. Click to open.",
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
        badge: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
      });
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body: "You got a reply from Support. Click to open.",
            icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
            badge: "https://cdn-icons-png.flaticon.com/512/833/833472.png",
          });
        }
      });
    }
  } else {
    console.log("User is on support page → no notification");
  }
}
