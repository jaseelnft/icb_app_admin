import { useEffect, useState } from "react";
import { Paging } from "../components/paging";
import { weiToICBX } from "../services/ethers";
import { formatDate } from "../services/simple";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { AppFilter, AppSearch } from "../components/input";
import { exportStakes, getStakings } from "../services/staking";

export const makeStakeStatus = (status: string) => {
  let cb = "py-1 px-2 text-xs font-bold rounded flex items-center gap-1 mb-1 ";
  let c = "text-[#01BF76] bg-[#01BF761a]";
  let t = "Processed";
  switch (status) {
    case "HOLDING":
      t = "Deposit";
      c = "text-[#F1941B] bg-[#F1941B1a]";
      break;
    case "WITHDRAW":
      t = "Withdrawn";
      c = "text-[#DF3A45] bg-[#DF3A451a]";
      break;
  }
  return <div className={cb + c}>{t}</div>;
};

export default function StakePage() {
  const [busy, setbusy] = useState(false);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [search, setsearch] = useState("");
  const [status, setstatus] = useState("");
  const [exportBusy, setexportBusy] = useState(false);

  useEffect(() => _loadDatas(1, "", ""), []);

  const _loadDatas = (page_: number, search_: string, status_: string) => {
    if (busy) return;
    setbusy(true);
    getStakings(page_, search_, status_)
      .then(async (res) => {
        setdatas(res.data);
        setpage(res.page);
        settotal(res.total);
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const _search = (value: string) => {
    setsearch(value);
    if (value.length > 2) _loadDatas(1, value, status);
    else if (value.length === 0) _loadDatas(1, "", status);
  };

  const onStatusFilter = (value: string) => {
    setstatus(value);
    _loadDatas(1, search, value);
  };

  const days = (endsOn: string) => {
    const _x = new Date(endsOn).getTime() - Date.now();
    return Math.floor(_x / (1000 * 60 * 60 * 24) + 1);
  };

  const elSt =
    "h-17 px-5 py-2 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  const onClickExport = async () => {
    if (exportBusy) return;
    setexportBusy(true);
    await exportStakes();
    setexportBusy(false);
  };

  return (
    <div className="p-5 lg:p-8 lg:max-w-[calc(100vw-260px)]">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold ">Staking Invests</span>
          &nbsp; ({total})
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px] overflow-x-scroll">
        <div className="w-full min-w-260">
          <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 justify-between items-center border-b border-[#16263B] text-sm">
            <div className="flex gap-3">
              <AppSearch onChange={_search} hint="Search by Hash" />
              <AppFilter
                onChange={onStatusFilter}
                list={[
                  { name: "All", value: "" },
                  { name: "Holding", value: "HOLDING" },
                  { name: "Withdraw", value: "WITHDRAW" },
                  { name: "Processed", value: "PROCESSED" },
                ]}
              />
            </div>
            <div
              className={
                "ShadedBtn Black rounded-full py-2 px-6 font-bold" +
                (exportBusy ? " BusyBtn" : "")
              }
              onClick={onClickExport}
            >
              Export Staking's
            </div>
          </div>
          <div className="flex text-[14px] px-2">
            <div className="min-w-16" />
            <div className={elSt + "py-4 w-[30%]"}>User</div>
            <div className={elSt + "py-4 w-[34%]"}>Plan/Days Left</div>
            <div className={elSt + "py-4 w-[26%] justify-end"}>Amount/Time</div>
            <div className={elSt + "py-4 w-[26%] justify-end"}>
              Earned/Returned
            </div>
            <div className={elSt + "py-4 w-[20%] justify-center"}>Status</div>
          </div>
          {busy && <div className="text-center text-sm p-4">Loading...</div>}
          {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
          {datas.map((_it: any, k) => (
            <div className="flex items-center odd:bg-[#0a101d] px-2" key={k}>
              <div className="py-4 pl-4 min-w-16 flex justify-center">
                <EthereumBlockie
                  address={_it.userId?.address}
                  id={_it.userId?._id}
                  size={36}
                />
              </div>
              <div className={elSt + "w-[30%]"}>
                <div>
                  <div>{_it.userId?.name || "null"}</div>
                  <div className="text-[#256DC9] text-sm">
                    <AddressT
                      showEmpty
                      address={_it.userId?.address}
                      iconSize={20}
                    />
                  </div>
                </div>
              </div>

              <div
                className={
                  elSt +
                  "w-[34%] text-[#B3BDCB] text-sm flex-col items-start justify-center"
                }
              >
                {_it?.planId?.name || "null"}
                <br />
                {_it.status === "HOLDING" ? `${days(_it.endsOn)} Days` : "--"}
              </div>

              <div
                className={
                  elSt +
                  "w-[26%] text-[#A5A7AA] text-sm text-right items-end flex-col justify-center"
                }
              >
                {weiToICBX(_it.invested ?? "0")} ICBX
                <div>{formatDate(_it.createdAt)}</div>
              </div>
              <div
                className={
                  elSt +
                  "w-[26%] text-sm text-right items-end flex-col justify-center"
                }
              >
                {_it.status === "PROCESSED"
                  ? weiToICBX(_it?.earned || 0) + " ICBX"
                  : "--"}
                <br />
                {weiToICBX(_it?.return || 0) + " ICBX"}
              </div>

              <div className={elSt + "w-[20%] justify-center  text-sm"}>
                {makeStakeStatus(_it?.status || "")}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Paging
        total={total}
        page={page}
        reload={(a1: any) => _loadDatas(a1, search, status)}
      />
    </div>
  );
}
