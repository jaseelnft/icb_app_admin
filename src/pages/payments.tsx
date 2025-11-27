import { useEffect, useState } from "react";
import { getSalesHistory } from "../services/orders";
import { IC } from "../components/librery";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { weiToICBX } from "../services/ethers";
import { StatusTags } from "../widgets/tags";
import { Paging } from "../components/paging";
import { formatDate } from "../services/simple";
import { AppSearch } from "../components/input";

export default function PaymentsPage() {
  const [busy, setbusy] = useState(false);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [search, setsearch] = useState("");

  useEffect(() => {
    loadDatas(1, "");
  }, []);

  const loadDatas = async (page_: number, search_: string) => {
    if (busy) return;
    setbusy(true);
    await getSalesHistory(page_, search_).then(async (res) => {
      setdatas(res.data);
      setpage(res.page);
      settotal(res.total);
    });
    setbusy(false);
  };

  const _search = (value: string) => {
    setsearch(value);
    if (value.length > 2) loadDatas(1, value);
    else if (value.length === 0) loadDatas(1, "");
  };

  const elSt =
    "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  return (
    <div className="p-5 lg:p-8 lg:max-w-[calc(100vw-260px)]">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold ">User Order Payments</span>
          &nbsp; ({total})
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px] overflow-x-scroll">
        <div className="w-full min-w-260">
          <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
            <AppSearch onChange={_search} hint="Search by Hash" />
          </div>
          <div className="flex text-[14px] px-2">
            <div className="min-w-16" />
            <div className={elSt + "py-5 w-[30%]"}>User</div>
            <div className={elSt + "py-5 w-[34%]"}>Hash/Payment Id</div>
            <div className={elSt + "py-5 w-[26%] justify-end"}>USDT/ICBX</div>
            <div className={elSt + "py-5 w-[26%]"}>Created At</div>
            <div className={elSt + "py-5 w-[20%] justify-center"}>Status</div>
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
                <AddressT showEmpty address={_it.hash} iconSize={20} />
                {_it.paymentId}
              </div>

              <div
                className={
                  elSt + "w-[26%] text-sm text-right flex-col items-end"
                }
              >
                <div>{_it.amount} USDT</div>
                {weiToICBX(_it.icbx ?? "0")} ICBX
              </div>
              <div className={elSt + "w-[26%] text-sm gap-1"}>
                <img src={IC.calender} className="w-[14px]" />
                {formatDate(_it.createdAt)}
              </div>

              <div className={elSt + "w-[20%] justify-center"}>
                <div className="capitalize mb-1 text-sm">{_it.type}</div>
                <StatusTags status={_it.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Paging
        total={total}
        page={page}
        reload={(a1: any) => loadDatas(a1, search)}
      />
      {/* {total > 10 && (
          <div className="flex justify-center mt-8">
            <div className="flex border border-[#16263B] rounded-[8px]">
              <div
                className="cursor-pointer py-2 px-4 border-r-1 border-[#16263B]"
                onClick={() => (page > 1 ? loadDatas(page - 1, search) : null)}
              >
                Previous
              </div>
              {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map(
                (it, k) => (
                  <div
                    onClick={() => loadDatas(it, search)}
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
                    ? loadDatas(page + 1, search)
                    : null
                }
              >
                Next
              </div>
            </div>
          </div>
        )} */}
    </div>
  );
}
