import { useEffect } from "react";
import { BG, IC } from "../components/librery";
import { getStatistics } from "../services/dashboard";
import { formatICBX } from "../services/simple";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const navigate = useNavigate();
  const data = useSelector((state: any) => state.data.dashboard);

  useEffect(() => {
    getStatistics()
  }, []);

  const _getHike = (last: number, prev: number) => {
    let hike = 0;
    let up = true;

    if (last !== prev) {
      if (last > 0 && prev > 0) {
        hike = (last / prev) * 100;
        if (last < prev) {
          up = false;
          hike = 100 - hike;
        } else {
          hike = hike - 100;
        }
      } else if (last > 0) {
        hike = 100;
      } else if (prev > 0) {
        hike = 100;
        up = false;
      }
    }
    return (
      <div
        className="px-2 py-[2px] rounded-[12px] text-[13px] flex gap-1"
        style={
          up
            ? { color: "#00B676", background: "#00B6761A" }
            : { color: "#DF3A45", background: "#DF3A451A" }
        }
      >
        {up && <img src={IC.graphUp} alt="GU" width="15" />}
        {!up && <img src={IC.graphDown} alt="GD" width="15" />}
        {hike.toFixed(1)}%
      </div>
    );
  };

  const _each1 = (
    title: string,
    value: string,
    last: number,
    prev: number,
    bg: string,
    ic: string,
    path: string
  ) => {
    return (
      <div
        className="px-6 py-7 rounded-[20px] border border-[#0110224D] relative w-[240px] h-[240px] overflow-hidden bg-no-repeat cursor-pointer"
        style={{ backgroundImage: `url(${bg})` }}
        onClick={() => navigate(path)}
      >
        <img src={ic} />
        <div className="mt-4">{title}</div>
        <div className="font-[ClashDisplay] text-[26px]">{value}</div>
        <div className="flex items-center gap-1 mt-3 text-[#C7CCD2] text-[14px]">
          {_getHike(last, prev)}
          {last}&nbsp;in 24h
        </div>
      </div>
    );
  };

  const _each2 = (
    title: string,
    value: string,
    last: number,
    prev: number,
    ic: string,
    path: string,
    isGraph: boolean
  ) => {
    return (
      <div
        className="rounded-[20px] relative w-[500px] h-[120px] overflow-hidden bg-no-repeat p-6 flex gap-4 items-center cursor-pointer"
        style={{ backgroundImage: `url(${BG.db})` }}
        onClick={() => navigate(path)}
      >
        <img src={ic} />
        <div className="w-full">
          <div className="text-[#4F8FE1] text-[20px]">{title}</div>
          <div className="text-[#C7CCD2] flex items-center justify-between mt-2">
            <b className="text-lg">{value}</b>
            {isGraph && (
              <div className="flex items-center gap-2">
                {_getHike(last, prev)}
                <span className="text-sm">{last}&nbsp;in 24h</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="max-w-[1100px] p-8 flex flex-wrap justify-center gap-5">
        {_each1(
          "Total Investments",
          formatICBX(data.investment || "0"),
          0,
          0,
          BG.b,
          IC.doller,
          "users"
        )}
        {_each1(
          "Total Users",
          data?.users?.total || "0",
          data?.users?.last24h,
          data?.users?.prev24h,
          BG.g,
          IC.users1,
          "users"
        )}
        {_each1(
          "Pending Approvals",
          data?.pendingApprovels || "0",
          0,
          0,
          BG.o,
          IC.pending,
          "withdraw-requests"
        )}
        {_each1(
          "Total Transactions",
          data?.txns || "0",
          0,
          0,
          BG.p,
          IC.txn,
          "transactions"
        )}
        {_each2(
          "Total Users in Chalenge",
          data?.challengeUsers?.total || "0",
          data?.challengeUsers?.last24h,
          data?.challengeUsers?.prev24h,
          IC.users2,
          "reward-logs",
          true
        )}
        {_each2(
          "Token Validators",
          data?.validators,
          0,
          0,
          IC.servers,
          "validator",
          false
        )}
        {_each2(
          "Total User Visits",
          data?.visits?.total || "0",
          data?.visits?.last24h,
          data?.visits?.prev24h,
          IC.eye1,
          "",
          true
        )}
        <div className="w-[500px]" />
      </div>
    </div>
  );
}
