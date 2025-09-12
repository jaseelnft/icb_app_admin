import { useEffect, useState } from "react";
import { getUsers } from "../services/dashboard";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { IC } from "../components/librery";

export default function UsersPage() {
  const [busy, setbusy] = useState(true);
  const [users, setusers] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [search, setsearch] = useState("");

  useEffect(() => _loadDatas(1, ""), []);

  const _loadDatas = (page_: number, search_: string) => {
    setbusy(true);
    getUsers(page_, search_)
      .then((res) => {
        setusers(res.data);
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
          <span className="text-[#4F8FE1] font-bold ">Platform Users</span> (
          {total})
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px]">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          <input
            placeholder="Search by User, Email, or Wallet Address"
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
          <div className={elSt + "py-5 w-[40%]"}>User</div>
          <div className={elSt + "py-5 w-[34%]"}>Wallet Address</div>
          <div className={elSt + "py-5 w-[26%]"}>Total Invested</div>
          <div className={elSt + "py-5 w-[26%]"}>ICBX Balance</div>
          <div className={elSt + "py-5 w-[20%]"}>Action</div>
        </div>
        {busy && <div className="text-center text-sm p-4">Loading...</div>}
        {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
        {users.map((_it: any, k) => (
          <div className="flex odd:bg-[#0a101d] px-2" key={k}>
            <div className="py-4 pl-4 min-w-16 flex justify-center">
              <EthereumBlockie address={_it.walletAddress} size={36} />
            </div>
            <div className={elSt + "w-[40%]"}>
              <div>
                <div>{_it.username || "null"}</div>
                <div className="text-[#256DC9] text-sm">
                  {_it.email || "null"}
                </div>
              </div>
            </div>

            <AddressT
              address={_it.walletAddress}
              iconSize={20}
              className={elSt + "w-[34%] text-[#B3BDCB] text-sm"}
            />

            <div className={elSt + "w-[26%] text-[#A5A7AA] text-sm"}>
              103,756.56 ICBX
            </div>
            <div className={elSt + "w-[26%] text-sm"}>103,756.56 ICBX</div>

            <div className={elSt + "w-[20%]"}>
              <div className="bg-[#4F8FE11A] border border-[#4F8FE14D] w-8 h-8 rounded cursor-pointer flex">
                <img src={IC.eye} className="min-w-2 min-h-2 p-[5px]" />
              </div>
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
