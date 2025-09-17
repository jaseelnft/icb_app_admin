import { useEffect, useState } from "react";
import { getTxns } from "../services/dashboard";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { IC } from "../components/librery";
import { weiToICBX } from "../services/ethers";
import { StatusTags } from "../widgets/tags";

export default function TransactionsPage() {
  const [busy, setbusy] = useState(true);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [search, setsearch] = useState("");

  useEffect(() => _loadDatas(1, ""), []);

  const _loadDatas = (page_: number, search_: string) => {
    setbusy(true);
    getTxns(page_, search_)
      .then(async (res) => {
        setdatas(res.data);
        setpage(res.page);
        settotal(res.total);
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const _search = (e: any) => {
    const value = e.target.value;
    setsearch(value);
    if (value.length > 2) _loadDatas(1, value);
    else if (value.length === 0) _loadDatas(1, "");
  };

  const elSt =
    "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 ";

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold ">
            Platform Transactions
          </span>
          &nbsp; ({total})
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px] overflow-hidden">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          <input
            placeholder="Search by Hash"
            className="border border-[#16263B] rounded-lg py-2 px-4 w-92 bg-[#0F1626]"
            style={{ backgroundImage: `url('${IC.lens}')` }}
            onChange={_search}
          />
          {/* <select
              className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
              id="search"
            >
              <option>All Status</option>
            </select> */}
        </div>
        <div className="flex text-[14px] px-2">
          <div className="min-w-16" />
          <div className={elSt + "py-5 w-[30%]"}>User</div>
          <div className={elSt + "py-5 w-[34%]"}>From/to</div>
          <div className={elSt + "py-5 w-[26%] justify-end"}>Amount</div>
          <div className={elSt + "py-5 w-[26%]"}>H1/H2</div>
          <div className={elSt + "py-5 w-[20%]"}>Type/Status</div>
        </div>
        {busy && <div className="text-center text-sm p-4">Loading...</div>}
        {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
        {datas.map((_it: any, k) => (
          <div className="flex odd:bg-[#0a101d] px-2" key={k}>
            <div className="py-4 pl-4 min-w-16 flex justify-center">
              <EthereumBlockie address={_it.userId?.address} size={36} />
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
                elSt + "w-[34%] text-[#B3BDCB] text-sm flex-col items-start"
              }
            >
              <AddressT showEmpty address={_it.from} iconSize={20} />
              <AddressT showEmpty address={_it.to} iconSize={20} />
            </div>

            <div
              className={
                elSt + "w-[26%] text-[#A5A7AA] text-sm text-right justify-end"
              }
            >
              {weiToICBX(_it.amount ?? "0")} ICBX
            </div>
            <div className={elSt + "w-[26%] text-sm items-start flex-col"}>
              <AddressT showEmpty address={_it.txnHash1} iconSize={20} />
              <AddressT showEmpty address={_it.txnHash2} iconSize={20} />
            </div>

            <div className={elSt + "w-[20%] flex-col items-start text-sm"}>
              <div className="capitalize mb-1 text-sm">{_it.type}</div>
              <StatusTags status={_it.status} />
            </div>
          </div>
        ))}
      </div>
      {total > 10 && (
        <div className="flex justify-center mt-8">
          <div className="flex border border-[#16263B] rounded-[8px]">
            <div
              className="cursor-pointer py-2 px-4 border-r-1 border-[#16263B]"
              onClick={() => (page > 1 ? _loadDatas(page - 1, search) : null)}
            >
              Previous
            </div>
            {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map(
              (it, k) => (
                <div
                  onClick={() => _loadDatas(it, search)}
                  className={
                    "cursor-pointer p-2 min-w-9 border-r-1 border-[#16263B] text-center" +
                    (page === it ? " bg-[#256DC9] text-white" : "")
                  }
                  key={k}
                >
                  {it}
                </div>
              )
            )}

            <div
              className="cursor-pointer py-2 px-4"
              onClick={() =>
                page < Math.ceil(total / 10)
                  ? _loadDatas(page + 1, search)
                  : null
              }
            >
              Next
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
