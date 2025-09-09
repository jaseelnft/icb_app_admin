import { useEffect, useState } from "react";
import { getUsers } from "../services/dashboard";
import { AddressT } from "../widgets/ethers";

export default function UsersPage() {
  const [busy, setbusy] = useState(true);
  const [users, setusers] = useState([]);

  useEffect(() => {
    getUsers()
      .then((res) => setusers(res))
      .catch(() => {})
      .finally(() => setbusy(false));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-[#4F8FE1] font-bold text-xl">
          Platform Users (10)
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px]">
        <div className="bg-[#011022] rounded-t-[16px] p-6">Users</div>
        <div className="flex text-[14px]">
          <div className="px-5 py-4 w-[50%]">User</div>
          <div className="px-5 py-4 w-[50%]">Wallet Address</div>
          <div className="px-5 py-4 w-[50%]">Total Invested</div>
          <div className="px-5 py-4 w-[50%]">ICBX Balance</div>
          <div className="px-5 py-4 w-[50%]">Action</div>
        </div>
        {busy && "Loading..."}
        {users.map((_it: any, k) => (
          <div className="flex items-center odd:bg-[#0a101d]" key={k}>
            <div className="px-5 py-4 w-[50%]">
              <div>
                <div>{_it.username || "null"}</div>
                <div className="text-[#256DC9] text-sm">{_it.email||'null'}</div>
              </div>
            </div>

            <AddressT
              address={_it.walletAddress}
              iconSize={20}
              className="px-5 py-4 w-[50%] text-[#B3BDCB] text-sm"
            />

            <div className="px-5 py-4 w-[50%] text-[#A5A7AA]">
              103,756.56 ICBX
            </div>
            <div className="px-5 py-4 w-[50%]">103,756.56 ICBX</div>
            <div className="px-5 py-4 w-[50%]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
