import { useEffect, useState } from "react";
import { getWithdrawal } from "../services/dashboard";
import { AddressT } from "../widgets/ethers";
import { formatDate, formatEther } from "../services/simple";
import { IC } from "../components/librery";

export default function WithdrawalPage() {
  const [busy, setbusy] = useState(true);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);

  useEffect(() => _loadDatas(1), []);

  const _loadDatas = (page_: number) => {
    setbusy(true);
    getWithdrawal(page_)
      .then((res) => {
        setdatas(res.data);
        setpage(res.page);
        settotal(res.total);
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const elSt =
    "px-4 py-3 flex items-center border-r border-[#16263B] last:border-0 ";

  const _status = (status: string) => {
    let bg = "#00B6761A";
    let c = "#00B676";
    if (status === "succes") {
      status = "Aproved";
    } else if (status === "rejected") {
      status = "Rejected";
      bg = "#DF3A451A";
      c = "#DF3A45";
    } else if (status === "pending") {
      status = "Pending";
      bg = "#F17F1B1A";
      c = "#F1941B";
    }

    return (
      <div className={elSt + "w-[18%]"}>
        <div
          className={`bg-[${bg}] px-2 py-1 rounded-[4px] text-xs text-[${c}] font-[600] flex items-center gap-1"`}
        >
          <div className={`w-2 h-2 bg-[${c}] rounded-[4px] mt-[1px]`} />
          {status}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold">Withdrawal Request</span> (
          {total})
        </div>
      </div>
      <div className="bg-[#010513] border-[1.5px] border-[#010513] mt-6 rounded-[16px] shadow-[0_0_8px_0_#4F8FE129] overflow-hidden">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          <input
            placeholder="Search by Name, Email, or Wallet Address"
            className="border border-[#16263B] rounded-lg py-2 px-4 w-92 bg-[#0F1626]"
            style={{ backgroundImage: `url('${IC.lens}')` }}
            id="search"
          />
          <select
            className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
            id="search"
          >
            <option>All Requiest</option>
            <option>Approved</option>
            <option>Pending</option>
            <option>Rejected</option>
          </select>
          <select
            className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
            id="search"
          ></select>
        </div>
        <div className="flex text-[14px] px-1">
          <div className={elSt + "py-5 w-[30%]"}>User</div>
          <div className={elSt + "py-5 w-[30%]"}>To Address</div>
          <div className={elSt + "py-5 w-[26%] text-right"}>Amount</div>
          <div className={elSt + "py-5 w-[26%] text-center"}>
            Requested On/Hash
          </div>
          <div className={elSt + "py-5 w-[18%] text-center"}>Status</div>
          <div className={elSt + "py-5 w-[20%] text-center"}>Action</div>
        </div>
        {busy && <div className="text-center text-sm p-4">Loading...</div>}
        {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
        {datas.map((_it: any, k) => (
          <div className="flex odd:bg-[#0a101d] px-1" key={k}>
            <div className={elSt + "flex-col gap-1 items-start w-[30%]"}>
              <div>{_it?.userId?.username || "null"}</div>
              <AddressT
                address={_it?.userId?.walletAddress}
                iconSize={20}
                className="text-[#256DC9] text-sm"
              />
            </div>
            <div className={elSt + "w-[30%]"}>
              <AddressT
                address={_it?.to || "0xnullnull"}
                iconSize={20}
                className="text-[#B3BDCB] text-sm"
              />
            </div>

            <div
              className={
                elSt + "w-[26%] min-h-[100%] text-[#A5A7AA] text-right text-sm"
              }
            >
              {formatEther(_it.amount)} ICBX
            </div>
            <div
              className={
                elSt +
                "flex-col gap-1 items-start justify-center w-[26%] text-[#A5A7AA] text-sm"
              }
            >
              <div className="flex gap-1">
                <img src={IC.calender} className="w-[14px]" />
                {formatDate(_it.createdAt)}
              </div>
              <AddressT
                address={_it?.txnHash1}
                iconSize={20}
                className="text-[#B3BDCB] text-sm"
              />
            </div>
            {_status(_it.status)}
            <div className={elSt + "w-[20%] gap-2"}>
              <div className="bg-[#00B6761A] border border-[#00B6761A] w-8 h-8 rounded cursor-pointer flex">
                <img src={IC.done} className="min-w-2 min-h-2 p-1" />
              </div>
              <div className="bg-[#F93C651A] border border-[#F93C654D] w-8 h-8 rounded cursor-pointer flex">
                <img src={IC.closeRed} className="min-w-2 min-h-2 p-1" />
              </div>
            </div>
          </div>
        ))}

        {total > 10 && (
          <div className="flex justify-center py-6 bg-[#011022]">
            <div className="flex border border-[#16263B] rounded-[8px]">
              <div
                className="cursor-pointer py-2 px-4 border-r-1 border-[#16263B]"
                onClick={() => (page > 1 ? _loadDatas(page - 1) : null)}
              >
                Previous
              </div>
              {Array.from(
                { length: Math.ceil(total / 10) },
                (_, i) => i + 1
              ).map((it, k) => (
                <div
                  onClick={() => _loadDatas(it)}
                  className={
                    "cursor-pointer p-2 min-w-9 border-r-1 border-[#16263B] text-center" +
                    (page === it ? " bg-[#256DC9] text-white" : "")
                  }
                  key={k}
                >
                  {it}
                </div>
              ))}

              <div
                className="cursor-pointer py-2 px-4"
                onClick={() =>
                  page < Math.ceil(total / 10) ? _loadDatas(page + 1) : null
                }
              >
                Next
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
