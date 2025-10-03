import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupportChats, getSupportMsgs } from "../services/support";
import { sendWSMSG } from "../services/config";

export default function SupportPage() {
  const [msg, setmsg] = useState("");

  const { chats, chat } = useSelector((state: any) => state.app);

  const _onSubmit = async (e: any) => {
    e.preventDefault();
    await sendWSMSG(chat._id, msg);
    setmsg("");
  };

  useEffect(() => {
    getSupportChats(1, false);
  }, []);

  const _onSelectChat = (k: any) => {
    getSupportMsgs(chats.data[k]);
  };

  const inputStyle =
    "rounded-[8px]  border-[1px] border-[#4f8fe1] bg-[#00000029] p-[10px_12px] text-sm w-full";

  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-275 w-full flex gap-4">
        <div className="min-w-75 border border-[#16263B] h-[calc(100vh-151px)] bg-[#010513] rounded-[16px] p-4">
          {chats?.data?.map((it: any, k: number) => (
            <div
              key={k}
              onClick={() => _onSelectChat(k)}
              className="p-3 border border-[#16263B] rounded my-2 cursor-pointer text-sm"
              style={{ color: it.registerd ? "" : "" }}
            >
              {it.registerd ? `U_${it.userId}` : `G_${it.accesLogId}`}
              <div>
                {it.activity}
                {it.unattended > 0 && ` New-${it.unattended} `}
                {it.status}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full border border-[#16263B] h-[calc(100vh-151px)] bg-[#010513] rounded-[16px] p-6">
          {!chat.empty && (
            <form
              onSubmit={_onSubmit}
              className="h-[calc(100vh-256px)] flex flex-col justify-between "
            >
              <div className="h-full flex flex-col gap-2">
                <div className="p-3 border border-[#16263B] rounded my-2 cursor-pointer text-sm">
                  {chat.registerd ? `U_${chat.userId}` : `G_${chat.accesLogId}`}
                </div>
                <div className="h-full overflow-auto flex flex-col gap-2 ">
                  {chat.chats.map((it: any, k: number) => (
                    <div
                      className="flex"
                      style={
                        it.from === "A" ? { justifyContent: "flex-end" } : {}
                      }
                      key={k}
                    >
                      <div className="text-xs border border-[#16263B] rounded p-2">
                        {it?.msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center mt-3 gap-2">
                <input
                  onChange={(e) => setmsg(e.target.value)}
                  value={msg}
                  className={inputStyle}
                  placeholder="Ask me"
                />
                <div className="btn1">Close_ticket</div>
              </div>
            </form>
          )}
          {chat.empty && (
            <div className="h-full flex justify-center items-center">
              Select a chat
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
