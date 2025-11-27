import { useEffect, useState } from "react";
import {
  exportValidRandomWallet,
  getRandomWallets,
  updareRandomWallets,
} from "../services/dashboard";
import { AddressT } from "../widgets/ethers";
import { Paging } from "../components/paging";
import { AppFilter } from "../components/input";

export default function RandomWalletsPage() {
  const [busy, setbusy] = useState(false);
  const [updateBusy, setupdateBusy] = useState(false);
  const [exportBusy, setexportBusy] = useState(false);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [status, setstatus] = useState("VALID");

  useEffect(() => _loadDatas(1), []);

  const _loadDatas = (page_: number, status_?: string) => {
    if (busy) return;
    setbusy(true);
    getRandomWallets(page_, status_ ?? status)
      .then((res) => {
        setdatas(res.data);
        setpage(res.page);
        settotal(res.total);
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const _onFilterStatus = (value: string) => {
    setstatus(value);
    _loadDatas(1, value);
  };

  const onClickUpdate = async () => {
    if (updateBusy) return;
    setupdateBusy(true);
    await updareRandomWallets();
    setupdateBusy(false);
  };

  const onClickExport = async () => {
    if (exportBusy) return;
    setexportBusy(true);
    await exportValidRandomWallet();
    setexportBusy(false);
  };

  const elSt =
    "px-4 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  return (
    <div className="p-5 lg:p-8 lg:max-w-[calc(100vw-260px)]">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold">Random Wallets</span> (
          {total})
        </div>
      </div>
      <div className="bg-[#010513] border-[1.5px] border-[#010513] mt-6 rounded-[16px] shadow-[0_0_8px_0_#4F8FE129] overflow-x-scroll">
        <div className="w-full min-w-260">
          <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm flex justify-between">
            <AppFilter
              onChange={_onFilterStatus}
              list={[
                { name: "Valid", value: "VALID" },
                { name: "All Assigned", value: "ASSIGNED" },
                { name: "All Wallets", value: "ALL" },
              ]}
            />
            <div className="flex gap-2">
              {status === "VALID" && total > 0 && (
                <div
                  className={
                    "ShadedBtn Black rounded-full py-2 px-6 font-bold" +
                    (exportBusy ? " BusyBtn" : "")
                  }
                  onClick={onClickExport}
                >
                  Export Valid address
                </div>
              )}
              {status === "VALID" && total > 0 && (
                <div
                  className={
                    "ShadedBtn rounded-full py-2 px-6 font-bold" +
                    (updateBusy ? " BusyBtn" : "")
                  }
                  onClick={onClickUpdate}
                >
                  Update wallets
                </div>
              )}
            </div>
          </div>
          <div className="flex text-[14px] px-1">
            <div className={elSt + "py-5 w-[45%]"}>User</div>
            <div className={elSt + "py-5 w-[45%]"}>Address</div>
            <div className={elSt + "py-5 w-[15%] text-center"}>Assigned</div>
            <div className={elSt + "py-5 w-[15%] text-center"}>Status</div>
          </div>
          {busy && <div className="text-center text-sm p-4">Loading...</div>}
          {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
          {datas.map((_it: any, k) => (
            <div className="flex odd:bg-[#0a101d] px-1" key={k}>
              <div className={elSt + "flex-col gap-1 items-start w-[45%]"}>
                <div>{_it?.userId?.name || "null"}</div>
                <AddressT
                  address={_it?.userId?.address}
                  iconSize={20}
                  className="text-[#256DC9] text-sm"
                />
              </div>
              <div className={elSt + "w-[45%]"}>
                <AddressT
                  address={_it?.address || "0xnullnull"}
                  iconSize={20}
                  className="text-[#B3BDCB] text-sm"
                />
              </div>
              <div className={elSt + "w-[15%]"}>
                {_it.assigned ? "Yes" : "No"}
              </div>
              <div className={elSt + "w-[15%] gap-2"}>{_it.status}</div>
            </div>
          ))}
          <Paging
            total={total}
            page={page}
            reload={(a1: any) => _loadDatas(a1)}
          />
        </div>
      </div>
    </div>
  );
}
