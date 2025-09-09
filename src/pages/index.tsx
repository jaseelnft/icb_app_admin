import { useEffect, useState } from "react";
import { BG, IC } from "../components/librery";
import { getStatistics } from "../services/dashboard";
import { formatICBX } from "../services/simple";

export default function DashboardPage() {
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
    ic: string
  ) => {
    return (
      <div
        className="p-7 rounded-[20px] border border-[#0110224D] relative w-[240px] h-[240px] overflow-hidden bg-no-repeat"
        style={{ backgroundImage: `url(${bg})` }}
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

  return (
    <div className="p-8 flex justify-center gap-5">
      {_each1(
        "Total Investments",
        formatICBX(statistics.investment || "0"),
        "0.00",
        BG.b,
        IC.doller
      )}
      {_each1("Total Users", statistics.users || "0", "0.00", BG.g, IC.users1)}
      {_each1(
        "Pending Approvals",
        statistics.pendingApprovels || "0",
        "0.00",
        BG.o,
        IC.pending
      )}
      {_each1(
        "Total Transactions",
        statistics.txns || "0",
        "0.00",
        BG.p,
        IC.txn
      )}
    </div>
  );
}
