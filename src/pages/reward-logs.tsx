import { useState } from "react";
import { updateRewardBalance } from "../services/dashboard";

export default function RewardLogsPage() {
  const [busy, setbusy] = useState(false);
  const [logs, setlogs] = useState([]);

  const _onUpdate = () => {
    if (busy) return;
    setbusy(true);
    updateRewardBalance()
      .then((res) => setlogs(res))
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  return (
    <div className="p-8">
      <div className="text-[#4F8FE1] font-[600] text-[22px]">
        Daily Reward Logs
      </div>
      <div className="mt-3 bg-[#011022] rounded-[12px] border border-[#16263B] p-8 flex items-center justify-between">
        <div>
          <div className="font-[600]">
            Click to Update the challenge balance of all users
          </div>
          {/* <div className="text-sm text-[orange]">Pending on 10-10-2025</div> */}
        </div>
        <button
          className={"btn1" + (busy ? " busybtn" : "")}
          onClick={_onUpdate}
        >
          Update Balance
        </button>
      </div>
      {logs.length > 0 && (
        <div className="mt-3 bg-[#011022] rounded-[12px] border border-[#16263B] p-8 flex items-center justify-between">
          {JSON.stringify(logs)}
        </div>
      )}
    </div>
  );
}
