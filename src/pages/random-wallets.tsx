import { useEffect, useState } from "react";
import { getRandomWallets } from "../services/dashboard";
import { AddressT } from "../widgets/ethers";

export default function RandomWalletsPage() {
  const [busy, setbusy] = useState(false);
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

  const _onFilterStatus = (e: any) => {
    setstatus(e.target.value);
    _loadDatas(1, e.target.value);
  };

  const elSt =
    "px-4 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold">Random Wallets</span> (
          {total})
        </div>
      </div>
      <div className="bg-[#010513] border-[1.5px] border-[#010513] mt-6 rounded-[16px] shadow-[0_0_8px_0_#4F8FE129] overflow-hidden w-[calc(100vw-330px)]">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          <select
            className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
            onChange={_onFilterStatus}
            value={status}
          >
            <option value="VALID">Valid</option>
            <option value="ASSIGNED">All Assigned</option>
            <option value="ALL">All Wallets</option>
          </select>
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

// function AproveBtn({ it, done }: any) {
//   const [on, seton] = useState(false);
//   const [busy, setbusy] = useState(false);
//   const [hash, sethash] = useState("");

//   const _confirm = async () => {
//     if (hash === "") return showErrorToast("Enter hash");
//     setbusy(true);
//     await aproveWithdraw(it._id, hash, "")
//       .then(() => {
//         seton(false);
//         done();
//       })
//       .catch(() => {})
//       .finally(() => setbusy(false));
//   };

//   return (
//     <>
//       <img
//         src={IC.done}
//         className="min-w-2 min-h-2 p-1 cursor-pointer"
//         onClick={() => seton(true)}
//       />
//       <Popup1
//         selected={on}
//         className="p-8 max-w-[540px] w-full"
//         close={() => seton(false)}
//       >
//         <img src={IC.succes} className="w-25" />
//         <div className="text-[24px] mt-5 mb-7 font-[600]">
//           Approve Withdrawal Request
//         </div>
//         <div className="text-[#C7CCD2] mb-2">
//           Transaction Hash <span className="text-[#DF3A45]">*</span>
//         </div>
//         <input
//           placeholder="Enter Txn Hash"
//           className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
//           value={hash}
//           onChange={(e) => sethash(e.target.value)}
//         />
//         <div className="flex gap-4 mt-12">
//           <button
//             className={
//               "ShadedBtn Black flex justify-center items-center rounded-full h-12 font-[600] w-full" +
//               (busy ? " BusyBtn" : "")
//             }
//             onClick={() => seton(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className={
//               "ShadedBtn flex justify-center items-center rounded-full h-12 font-[600] w-full" +
//               (busy ? " BusyBtn" : "")
//             }
//             onClick={_confirm}
//           >
//             Confirm & Approve
//           </button>
//         </div>
//       </Popup1>
//     </>
//   );
// }

// function RejectBtn({ it, done }: any) {
//   const [on, seton] = useState(false);
//   const [busy, setbusy] = useState(false);
//   const [note, setnote] = useState("");

//   const _rejects = async () => {
//     setbusy(true);
//     await rejectWithdraw(it._id, note)
//       .then(() => {
//         seton(false);
//         done();
//       })
//       .catch(() => {})
//       .finally(() => setbusy(false));
//   };

//   return (
//     <>
//       <img
//         src={IC.closeRed}
//         className="min-w-2 min-h-2 p-1 cursor-pointer"
//         onClick={() => seton(true)}
//       />
//       <Popup1
//         selected={on}
//         className="p-8 max-w-[540px] w-full"
//         close={() => seton(false)}
//       >
//         <img src={IC.error} className="w-25" />
//         <div className="text-[24px] mt-5 mb-2 font-[600]">
//           Reject Withdrawal Request
//         </div>
//         <div>
//           Are you sure you want to reject this withdrawal request? This action
//           cannot be undone.
//         </div>
//         <div className="text-[#C7CCD2] mt-8 mb-2">Note</div>
//         <input
//           placeholder="Enter reason"
//           className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
//           value={note}
//           onChange={(e) => setnote(e.target.value)}
//         />
//         <div className="flex gap-4 mt-12">
//           <button
//             className={
//               "ShadedBtn Black flex justify-center items-center rounded-full h-12 font-[600] w-full" +
//               (busy ? " BusyBtn" : "")
//             }
//             onClick={() => seton(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className={
//               "ShadedBtn flex justify-center items-center rounded-full h-12 font-[600] w-full" +
//               (busy ? " BusyBtn" : "")
//             }
//             onClick={_rejects}
//           >
//             Reject Request
//           </button>
//         </div>
//       </Popup1>
//     </>
//   );
// }
