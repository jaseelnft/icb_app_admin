import { io } from "socket.io-client";
import { setChats, store } from "../redux/store";

var BASE_WS = import.meta.env.VITE_BASE_WS;

const socket = io(BASE_WS, { transports: ["websocket"] });

export const connectWs = () => {
  socket.on("connect", () => {});

  socket.emit("message", { type: "REG", from: "ADMIN" });

  socket.on("message", (data) => {
    if (data.type === "MSG") {
      store.dispatch(setChats({ id: data.clientId, msg: data.msg }));
    } else if (data.type === "REG") {
      store.dispatch(setChats({ id: data.clientId, chat: [] }));
    }
  });
};

export const sendWSMSG = async (to: string, msg: string) => {
  const payload = { msg, type: "MSG", from: "ADMIN", to };
  store.dispatch(setChats({ id: to, msg: payload }));
  socket.emit("message", payload);
};
