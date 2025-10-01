import { useState } from "react";
import { useSelector } from "react-redux";
import { sendWSMSG } from "../services/ws";

export default function SupportPage() {
  const [msg, setmsg] = useState("");
  const [clientId, setclientId] = useState("");

  const { chats } = useSelector((state: any) => state.app);

  const _onSubmit = async (e: any) => {
    e.preventDefault();
    await sendWSMSG(clientId, msg);
    setmsg("");
  };

  const inputStyle =
    "rounded-[8px]  border-[1px] border-[#4f8fe1] bg-[#00000029] p-[10px_12px] text-sm w-full mt-4";

  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-275 w-full flex gap-4">
        <div className="min-w-75 border border-[#16263B] h-[calc(100vh-151px)] bg-[#010513] rounded-[16px] p-4">
          {Object.entries(chats).map(([key], k) => (
            <div
              key={k}
              onClick={() => setclientId(key)}
              className="p-3 border border-[#16263B] rounded my-2 cursor-pointer text-sm"
            >
              {key}
            </div>
          ))}
        </div>
        <div className="w-full border border-[#16263B] h-[calc(100vh-151px)] bg-[#010513] rounded-[16px] p-6">
          {clientId !== "" && (
            <form onSubmit={_onSubmit} className="h-full flex flex-col-reverse">
              <input
                onChange={(e) => setmsg(e.target.value)}
                value={msg}
                className={inputStyle}
                placeholder="Ask me"
              />
              <div className="h-full flex flex-col justify-end gap-2 overflow-auto">
                {chats[clientId].map((it: any, k: number) => (
                  <div
                    className="flex"
                    style={
                      it.from === "ADMIN" ? { justifyContent: "flex-end" } : {}
                    }
                    key={k}
                  >
                    <div className="text-xs border border-[#16263B] rounded p-2">
                      {it?.msg}
                    </div>
                  </div>
                ))}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
