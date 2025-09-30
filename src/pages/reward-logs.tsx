import { useEffect, useState } from "react";
import { getRewardUsers, updateRewardBalance } from "../services/dashboard";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { IC } from "../components/librery";
import { weiToICBX } from "../services/ethers";
import { Paging } from "../components/paging";
import { formatDate } from "../services/simple";

export default function RewardLogsPage() {
  const [busy, setbusy] = useState(false);
  const [logs, setlogs] = useState([]);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [search, setsearch] = useState("");

  useEffect(() => {
    _loadDatas(1, "");
  }, []);

  const _loadDatas = (page_: number, search_: string) => {
    if (busy) return;
    setbusy(true);
    getRewardUsers(page_, search_)
      .then((res) => {
        setdatas(res.data);
        setpage(res.page);
        settotal(res.total);
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const _onUpdate = () => {
    if (busy) return;
    setbusy(true);
    updateRewardBalance()
      .then((res) => setlogs(res))
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
    "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  return (
    <div className="p-8">
      <div className="text-[#4F8FE1] font-[600] text-[22px]">
        Daily Reward Logs
      </div>
      <div className="mt-3 bg-[#011022] rounded-[12px] border border-[#16263B] p-8 flex items-center justify-between">
        <div>
          <div className="font-[600]">
            Click to Update the challenge balance of all users
          </div>
          {/* <div className="text-sm text-[orange]">Pending on 10-10-2025</div> */}
        </div>
        <button
          className={"btn1" + (busy ? " busybtn" : "")}
          onClick={_onUpdate}
        >
          Update Balance
        </button>
      </div>
      {logs.length > 0 && (
        <div className="mt-3 bg-[#011022] rounded-[12px] border border-[#16263B] p-8 flex items-center justify-between">
          {JSON.stringify(logs)}
        </div>
      )}
      {/*  */}
      {/*  */}
      {/*  */}
      {/*  */}
      <div className="font-[600] text-[20px] mt-6">
        List of users Joined ({total})
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-3 rounded-[16px] overflow-hidden">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          <input
            placeholder="Search by name, address or email"
            className="border border-[#16263B] rounded-lg py-2 px-4 w-92 bg-[#0F1626]"
            style={{ backgroundImage: `url('${IC.lens}')` }}
            onChange={_search}
          />
          {/* <select
                  className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
                  id="search"
              >
                <option>All Status</option>
              </select> 
          */}
        </div>
        <div className="flex text-[14px] px-2">
          <div className="min-w-16" />
          <div className={elSt + "py-5 w-[40%]"}>User</div>
          <div className={elSt + "py-5 w-[34%]"}>Wallet Address</div>
          <div className={elSt + "py-5 w-[26%] justify-end"}>
            Joining Balance/Date
          </div>
          <div className={elSt + "py-5 w-[26%] justify-end"}>
            Avarage Balance
          </div>
          <div className={elSt + "py-5 w-[20%]"}>Action</div>
        </div>
        {busy && <div className="text-center text-sm p-4">Loading...</div>}
        {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
        {datas.map((_it: any, k: number) => (
          <div className="flex odd:bg-[#0a101d] px-2" key={k}>
            <div className="py-4 pl-4 min-w-16 flex justify-center">
              <EthereumBlockie address={_it.user.address} size={36} />
            </div>
            <div className={elSt + "w-[40%]"}>
              <div>
                <div>{_it.user.name || "null"}</div>
                <div className="text-[#256DC9] text-sm">
                  {_it.user.email || "null"}
                </div>
              </div>
            </div>

            <AddressT
              address={_it.user.address}
              iconSize={20}
              className={elSt + "w-[34%] text-[#B3BDCB] text-sm"}
            />

            <div
              className={
                elSt + "w-[26%] text-[#A5A7AA] text-sm items-end flex-col"
              }
            >
              {weiToICBX(_it.balance ?? "0")} ICBX
              <div>{formatDate(_it.createdAt)}</div>
            </div>
            <div
              className={
                elSt + "w-[26%] text-[#A5A7AA] text-sm text-right justify-end"
              }
            >
              {weiToICBX(_it.avgBalance ?? "0")} ICBX
              {/* {weiToICBX(_it.balance ?? "0")} ICBX */}
            </div>

            <div className={elSt + "w-[20%]"}>
              <div className="bg-[#4F8FE11A] border border-[#4F8FE14D] w-8 h-8 rounded cursor-pointer flex">
                <img src={IC.eye} className="min-w-2 min-h-2 p-[5px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Paging
        total={total}
        page={page}
        reload={(a1: any) => _loadDatas(a1, search)}
      />
    </div>
  );
}
