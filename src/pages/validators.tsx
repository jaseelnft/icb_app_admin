import { useEffect, useState } from "react";
import { getValidators } from "../services/dashboard";
import { AddressT } from "../widgets/ethers";
import { IC } from "../components/librery";
import { formatEther } from "../services/simple";

export default function ValidatorsPage() {
  const [busy, setbusy] = useState(true);
  const [datas, setdatas] = useState([]);

  useEffect(() => _loadDatas(), []);

  const _loadDatas = () => {
    setbusy(true);
    getValidators()
      .then((res) => setdatas(res))
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 10_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return num.toLocaleString();
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="flex justify-between items-center max-w-[1020px] w-full">
        <div className="font-bold font-[ClashDisplay] text-xl">
          Validators Server
        </div>
        <button className="btn1" style={{ fontSize: 14, fontWeight: 400 }}>
          + Add New Validator
        </button>
      </div>
      <div className="flex flex-wrap gap-5 max-w-[1020px] w-full mt-10">
        {busy && <div className="text-center text-sm p-4">Loading...</div>}
        {datas.length < 1 && (
          <div className="text-center text-sm p-4">No Data</div>
        )}
        {datas.map((it: any, k) => (
          <div
            key={k}
            className="border-[2px] border-[#AFD2FF33] min-w-[500px] rounded-[26px] bg-[#011022]"
          >
            <div className="bg-gradient-to-b from-[#0F2644] to-[#061C37] py-5 px-7 rounded-t-[24px] flex items-center">
              <div className="flex align-center justify-center bg-[#011022] rounded-[50%] min-w-[72px] h-[72px]">
                <img src={IC.validator_} className="w-[32px]" />
              </div>
              <div className="pl-4 w-[100%]">
                <div className="text-[#4F8FE1]">{it.name}</div>
                <AddressT
                  address={it.address}
                  className="text-white text-[20px]"
                />
              </div>
              <img
                src={IC.eye}
                className="cursor-pointer"
                // onClick={() => navigate(it._id)}
              />
            </div>
            <div className="p-8">
              <div className="flex justify-between align-center">
                Invested
                <div className="text-[20px] font-[600]">
                  {/* {formatNumber(formatEther(it.invested))}{" "} */}
                  <span className="text-[#4F8FE1]">ICBX</span>
                </div>
              </div>
              <div className="h-3 bg-[#ffffff1a] rounded-[10px] flex mt-6">
                <div
                  className={`h-3 bg-gradient-to-r from-[#00BF76] to-[#5EE8AA] rounded-[10px]`}
                  style={{
                    width: `${(it.invested / it.capacity) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="text-[18px] font-[600]">
                  Available / Capacity
                </div>
                <div>
                  {/* {formatNumber(formatEther(getFreeSpace(it) || "0"))} ICBX */}
                  &nbsp;/&nbsp;
                  {formatNumber(formatEther(it.capacity))} ICBX
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                {/* <InvestPop server={it} reload={_loadData} />
                      <WithdrawPop server={it} reload={_loadData} /> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
