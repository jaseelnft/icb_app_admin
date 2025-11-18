import { useEffect, useState } from "react";
import { getTxns } from "../services/dashboard";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { weiToICBX } from "../services/ethers";
import { StatusTags } from "../widgets/tags";
import { Paging } from "../components/paging";
import { AppFilter, AppSearch } from "../components/input";
import { formatDate } from "../services/simple";

export default function TransactionsPage() {
  const [busy, setbusy] = useState(false);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [search, setsearch] = useState("");
  const [status, setstatus] = useState("");
  const [type, settype] = useState("DEPOSIT,WITHDRAWAL");

  useEffect(() => _loadDatas(1, "", "", type), []);

  const _loadDatas = (
    page_: number,
    search_: string,
    status_: string,
    type_: string
  ) => {
    if (busy) return;
    setbusy(true);
    getTxns(page_, search_, status_, type_)
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
    if (value.length > 2) _loadDatas(1, value, status, type);
    else if (value.length === 0) _loadDatas(1, "", status, type);
  };

  const onStatusFilter = (value: string) => {
    setstatus(value);
    _loadDatas(1, search, value, type);
  };

  const onTypeFilter = (value: string) => {
    settype(value);
    _loadDatas(1, search, status, value);
  };

  const elSt =
    "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

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
          <AppSearch onChange={_search} hint="Search by Hash" />
          <AppFilter
            onChange={onStatusFilter}
            list={[
              { name: "All", value: "" },
              { name: "Pending", value: "PENDING" },
              { name: "Failed", value: "FAILED" },
              { name: "Success", value: "SUCCESS" },
              { name: "Rejected", value: "REJECTED" },
            ]}
          />
          <AppFilter
            onChange={onTypeFilter}
            list={[
              { name: "Deposit & Withdrawal", value: "DEPOSIT,WITHDRAWAL" },
              { name: "Deposit", value: "DEPOSIT" },
              { name: "Withdrawal", value: "WITHDRAWAL" },
              { name: "Out", value: "OUT" },
              { name: "In", value: "IN" },
              { name: "In & Out", value: "IN,OUT" },
              { name: "Profit", value: "PROFIT" },
            ]}
          />
        </div>
        <div className="flex text-[14px] px-2">
          <div className="min-w-16" />
          <div className={elSt + "py-5 w-[30%]"}>User</div>
          <div className={elSt + "py-5 w-[34%]"}>From/to</div>
          <div className={elSt + "py-5 w-[26%] justify-end"}>Amount/Time</div>
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
                elSt +
                "w-[26%] text-[#A5A7AA] text-sm text-right items-end flex-col"
              }
            >
              {weiToICBX(_it.amount ?? "0")} ICBX
              <div>{formatDate(_it.createdAt)}</div>
            </div>
            <div className={elSt + "w-[26%] text-sm items-start flex-col"}>
              <AddressT showEmpty address={_it.txnHash1} iconSize={20} />
              <AddressT showEmpty address={_it.txnHash2} iconSize={20} />
            </div>

            <div className={elSt + "w-[20%] flex-col items-start text-sm"}>
              <div className="mb-1 text-sm capitalize">
                {_it?.type?.toLowerCase()}
              </div>
              <StatusTags status={_it.status} />
            </div>
          </div>
        ))}
      </div>
      <Paging
        total={total}
        page={page}
        reload={(a1: any) => _loadDatas(a1, search, status, type)}
      />
    </div>
  );
}
