import { useEffect } from "react";
import { BG, IC } from "../components/librery";
import { getStatistics } from "../services/dashboard";
import { formatEther, formatICBX } from "../services/simple";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const navigate = useNavigate();
  const data = useSelector((state: any) => state.data.dashboard);

  useEffect(() => {
    getStatistics();
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
        className="px-2 py-[2px] rounded-[12px] text-[10px] lg:text-[13px] flex gap-1"
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
    value: string | number,
    last: number,
    prev: number,
    bg: string,
    ic: string,
    path: string,
    options?: { isICBX?: boolean }
  ) => {
    options = { isICBX: false, ...options };
    return (
      <div
        className="px-4 py-4 lg:px-6 lg:py-7 rounded-[12px] lg:rounded-[20px] border border-[#0110224D] relative w-40 h-39 lg:w-60 lg:h-58 overflow-hidden bg-no-repeat bg-cover bg-center cursor-pointer"
        style={{ backgroundImage: `url(${bg})` }}
        onClick={() => navigate(path)}
      >
        <img src={ic} className="w-12 h-12 lg:w-16 lg:h-16" />
        <div className="mt-2 lg:mt-4 text-xs lg:text-base">{title}</div>
        <div className="font-[ClashDisplay] text-[19px] lg:text-[26px]">
          {options.isICBX ? formatICBX(Number(value)) : value}
        </div>
        <div className="flex items-center gap-1 mt-1 lg:mt-3 text-[#C7CCD2] text-xs lg:text-sm">
          {_getHike(last, prev)}
          {options.isICBX ? formatICBX(Number(last)) : last}&nbsp;in 24h
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
        className="rounded-[14px] lg:rounded-[20px] relative max-w-125 w-full lg:w-[calc(100%-144px)] overflow-hidden bg-no-repeat p-4 lg:p-6 flex gap-4 items-center cursor-pointer"
        style={{ backgroundImage: `url(${BG.db})` }}
        onClick={() => navigate(path)}
      >
        <img src={ic} className="w-12 lg:w-18" />
        <div className="w-full">
          <div className="text-[#4F8FE1] text-sm lg:text-[20px]">{title}</div>
          <div className="text-[#C7CCD2] flex items-center justify-between mt-1 lg:mt-2">
            <b className="text-base lg:text-lg">{value}</b>
            {isGraph && (
              <div className="flex items-center gap-2">
                {_getHike(last, prev)}
                <span className="text-xs lg:text-sm">{last}&nbsp;in 24h</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-1 py-3 lg:px-8 lg:py-8 flex items-center flex-col">
      <div className="max-w-[1100px] px-0 py-3 lg:px-8 lg:py-8 flex flex-wrap justify-center gap-2 lg:gap-5">
        {_each1(
          "Total WICBX",
          formatEther(data?.wicbx?.total || "0"),
          Math.floor(data?.wicbx?.last24h || 0),
          Math.floor(data?.wicbx?.prev24h || 0),
          BG.b,
          IC.doller,
          "users",
          { isICBX: true }
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
        {_each1(
          "Investments",
          formatEther(data?.investment?.total || "0"),
          Math.floor(data?.investment?.last24h || 0),
          Math.floor(data?.investment?.prev24h || 0),
          BG.r,
          IC.investments,
          "users",
          { isICBX: true }
        )}
        {_each1(
          "Invested Count",
          data?.investCount?.total || "0",
          data?.investCount?.last24h,
          data?.investCount?.prev24h,
          BG.dg,
          IC.invested,
          "users"
        )}
        {_each1(
          "Pending Wallets",
          data?.validWallets?.total || "0",
          data?.validWallets?.last24h,
          data?.validWallets?.prev24h,
          BG.y,
          IC.wallets,
          "withdraw-requests"
        )}
        {_each1(
          "Pending Orders",
          data?.order?.total || "0",
          data?.order?.last24h,
          data?.order?.prev24h,
          BG.lg,
          IC.orders,
          "transactions"
        )}
      </div>
      <div className="w-full max-w-[1100px] py-3 px-5 lg:py-8 lg:px-8 flex flex-wrap justify-center gap-3 lg:gap-5">
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
        {/* {_each2(
          "Validators Invests",
          data?.validators,
          0,
          0,
          IC.servers,
          "validator",
          false
        )}
        {_each2(
          "Validators investment",
          data?.validators,
          0,
          0,
          IC.servers,
          "validator",
          false
        )} */}
        {_each2(
          "Total User Visits",
          data?.visits?.total || "0",
          data?.visits?.last24h,
          data?.visits?.prev24h,
          IC.eye1,
          "",
          true
        )}
        <div className="hidden lg:block w-[500px]" />
      </div>
    </div>
  );
}
