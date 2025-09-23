import { useEffect, useState } from "react";
import { BG, IC } from "../components/librery";
import { getStatistics } from "../services/dashboard";
import { formatICBX } from "../services/simple";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [statistics, setstatistics]: any = useState({});

  useEffect(() => {
    getStatistics()
      .then((res) => setstatistics(res))
      .catch(() => {})
      .finally(() => {});
  }, []);

  const _each1 = (
    title: string,
    value: string,
    hike: string,
    bg: string,
    ic: string,
    path: string
  ) => {
    return (
      <div
        className="p-7 rounded-[20px] border border-[#0110224D] relative w-[240px] h-[240px] overflow-hidden bg-no-repeat cursor-pointer"
        style={{ backgroundImage: `url(${bg})` }}
        onClick={() => navigate(path)}
      >
        <img src={ic} />
        <div className="mt-4">{title}</div>
        <div className="font-[ClashDisplay] text-[26px]">{value}</div>
        <div className="flex items-center gap-2 mt-3 text-[#C7CCD2] text-[14px]">
          <div className="px-3 py-[2px] bg-[#00B6761A] text-[#00B676] rounded-[12px] text-[13px]">
            {hike}%
          </div>
          from yesterday
        </div>
      </div>
    );
  };

  const _each2 = (title: string, value: string, ic: string, path: string) => {
    return (
      <div
        className="rounded-[20px] relative w-[500px] h-[120px] overflow-hidden bg-no-repeat p-6 flex gap-4 items-center cursor-pointer"
        style={{ backgroundImage: `url(${BG.db})` }}
        onClick={() => navigate(path)}
      >
        <img src={ic} />
        <div>
          <div className="text-[#4F8FE1] text-[20px]">{title}</div>
          <div className="text-[#C7CCD2]">{value}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-[1100px] p-8 flex flex-wrap justify-center gap-5">
        {_each1(
          "Total Investments",
          formatICBX(statistics.investment || "0"),
          "0.00",
          BG.b,
          IC.doller,
          "users"
        )}
        {_each1(
          "Total Users",
          statistics.users || "0",
          "0.00",
          BG.g,
          IC.users1,
          "users"
        )}
        {_each1(
          "Pending Approvals",
          statistics.pendingApprovels || "0",
          "0.00",
          BG.o,
          IC.pending,
          "withdraw-requests"
        )}
        {_each1(
          "Total Transactions",
          statistics.txns || "0",
          "0.00",
          BG.p,
          IC.txn,
          "transactions"
        )}
        {_each2(
          "Total Users in Chalenge",
          statistics.challengeUsers || "0",
          IC.users2,
          "reward-logs"
        )}
        {_each2("Token Validators", "18", IC.servers, "validator")}
      </div>
    </div>
  );
}
