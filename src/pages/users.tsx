import { useEffect, useState } from "react";
import { getUsers } from "../services/dashboard";
import { AddressT, EthereumBlockie } from "../widgets/ethers";

export default function UsersPage() {
  const [busy, setbusy] = useState(true);
  const [users, setusers] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);

  useEffect(() => _loadUsers(1), []);

  const _loadUsers = (page_: number) => {
    setbusy(true);
    getUsers(page_)
      .then((res) => {
        setusers(res.data);
        setpage(res.page);
        settotal(res.total);
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-[#4F8FE1] font-bold text-xl">
          Platform Users (10)
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px]">
        <div className="bg-[#011022] rounded-t-[16px] p-6">Users</div>
        <div className="flex text-[14px] px-4">
          <div className="min-w-18" />
          <div className="px-5 py-4 w-[50%]">User</div>
          <div className="px-5 py-4 w-[34%]">Wallet Address</div>
          <div className="px-5 py-4 w-[26%]">Total Invested</div>
          <div className="px-5 py-4 w-[26%]">ICBX Balance</div>
          <div className="px-5 py-4 w-[20%] text-center">Action</div>
        </div>
        {busy && "Loading..."}
        {users.map((_it: any, k) => (
          <div className="flex items-center odd:bg-[#0a101d] px-4" key={k}>
            <div className="py-4 pl-4 min-w-18 flex justify-center">
              <EthereumBlockie address={_it.walletAddress} size={40} />
            </div>
            <div className="px-5 py-4 w-[50%]">
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
              className="px-5 py-4 w-[34%] text-[#B3BDCB] text-sm"
            />

            <div className="px-5 py-4 w-[26%] text-[#A5A7AA]">
              103,756.56 ICBX
            </div>
            <div className="px-5 py-4 w-[26%]">103,756.56 ICBX</div>
            <div className="px-5 py-4 w-[20%]"></div>
          </div>
        ))}
      </div>
      <div className="flex justify-center  mt-8">
        <div className="flex border border-[#16263B] rounded-[8px]">
          <div
            className="cursor-pointer py-2 px-4 border-r-1 border-[#16263B]"
            onClick={() => (page > 1 ? _loadUsers(page - 1) : null)}
          >
            Previous
          </div>
          {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map(
            (it, k) => (
              <div
                onClick={() => _loadUsers(it)}
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
              page < Math.ceil(total / 10) ? _loadUsers(page + 1) : null
            }
          >
            Next
          </div>
        </div>
      </div>
    </div>
  );
}
