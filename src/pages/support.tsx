import { useState } from "react";
import { useSelector } from "react-redux";
import { closeChatTicket, getSupportMsgs } from "../services/support";
import { sendWSMSG } from "../services/config";
import { IC } from "../components/librery";

export default function SupportPage() {
  const [msg, setmsg] = useState("");

  const { chats, chat } = useSelector((state: any) => state.app);

  const _onSubmit = async (e: any) => {
    e.preventDefault();
    if (msg === "") return;
    await sendWSMSG(chat._id, msg);
    setmsg("");
  };

  const _onSelectChat = (k: any) => {
    getSupportMsgs(chats[k]._id);
  };

  const _onCloseChat = async () => {
    await closeChatTicket(chat._id);
  };

  function formatDateTime(isoString: string) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();

    const options: any = { hour: "numeric", minute: "numeric", hour12: true };
    const timeString = date.toLocaleString("en-US", options);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (dateOnly.getTime() === today.getTime()) {
      return `${timeString}`;
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      return `Yesterday ${timeString}`;
    } else {
      const dateOptions: any = {
        month: "short",
        day: "2-digit",
        year: "numeric",
      };
      const dateString = date.toLocaleDateString("en-US", dateOptions);
      return `${dateString} ${timeString}`;
    }
  }

  return (
    <div className="p-4 flex justify-center">
      <div className="max-w-275 w-full flex gap-3">
        <div className="min-w-75 border border-[#16263B] h-[calc(100vh-121px)] bg-[#010513] rounded-[16px] p-4">
          {chats.map((it: any, k: number) => (
            <div
              key={k}
              onClick={() => _onSelectChat(k)}
              className="p-3 rounded my-2 cursor-pointer text-sm"
              style={
                it.registerd
                  ? { background: "#141414" }
                  : { background: "#011022" }
              }
            >
              <div className="flex justify-between">
                {it.registerd ? "Registerd User" : "Gust User"}
                <div>{it.activity}</div>
                {/* <div className="text-xs">
                {it.registerd ? it.userId : it.accesLogId}
              </div> */}
              </div>
              <div className="text-xs">
                {it.unattended > 0 && ` New-${it.unattended} `}
                {/* {it.status} */}
              </div>
            </div>
          ))}
        </div>
        {/*  */}
        {/*  */}
        {/*  */}
        <div className="w-full border border-[#16263B] h-[calc(100vh-121px)] bg-[#010513] rounded-[16px] overflow-hidden">
          {!chat.empty && (
            <form onSubmit={_onSubmit} className="h-full flex flex-col">
              <div className="flex items-center justify-between py-5 px-6">
                <div className="flex items-center gap-3">
                  <img src="/favicon.svg" className="w-10" />
                  <div>
                    <div className="font-bold">
                      {chat.registerd ? "Registerd User" : "Gust User"}
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      {chat.registerd ? chat.userId : chat.accesLogId}
                      <div className="border border-[#16263B] text-xs font-bold px-1 rounded-full">
                        {chat.activity}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="btn1"
                  style={{ padding: "11px 24px" }}
                  onClick={() => _onCloseChat()}
                >
                  Close the Ticket
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#010513] via-[#4D91FE] to-[#010513] w-full min-h-[1px]" />
              <div className="h-full overflow-auto flex flex-col-reverse gap-2 p-6">
                {chat.msgs.map((it: any, k: number) => (
                  <div
                    className="flex flex-col gap-1"
                    style={it.from === "U" ? { alignItems: "flex-end" } : {}}
                    key={k}
                  >
                    <div className="flex gap-2">
                      {/* {it.from === "A" && (
                        <img
                          src={IC.robo}
                          className="bg-[#4F8FE19f] w-8 h-8 rounded-full p-2"
                        />
                      )} */}
                      <div
                        className="text-xs rounded-[6px] py-2 px-3 leading-[1.6]"
                        style={
                          it.from === "U"
                            ? { background: "#141414", marginLeft: 20 }
                            : { background: "#011022", marginRight: 20 }
                        }
                      >
                        {it.msg}
                      </div>
                    </div>
                    <div className="text-[10px] text-[#FFFFFF66]">
                      {formatDateTime(it.createdAt)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#011022] p-3 flex items-center">
                <input
                  onChange={(e) => setmsg(e.target.value)}
                  value={msg}
                  className="rounded-[8px] p-2 text-xs w-full outline-0"
                  placeholder="Type here..."
                />
                <button
                  type="submit"
                  className="min-w-7 w-7 h-7 bg-[#0088FF] mr-2 rounded-full cursor-pointer p-2"
                >
                  <img src={IC.send} className="w-full" />
                </button>
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
