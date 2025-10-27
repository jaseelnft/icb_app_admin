import { useEffect, useState } from "react";
import {
  aproveWithdraw,
  getWithdrawal,
  rejectWithdraw,
} from "../services/dashboard";
import { AddressT } from "../widgets/ethers";
import { formatDate, formatEther } from "../services/simple";
import { IC } from "../components/librery";
import { Popup1 } from "../layouts/popup";
import { showErrorToast } from "../services/toast";
import { StatusTags } from "../widgets/tags";

export default function WithdrawalPage() {
  const [busy, setbusy] = useState(false);
  const [datas, setdatas] = useState([]);
  const [page, setpage] = useState(1);
  const [total, settotal] = useState(0);
  const [status, setstatus] = useState("");

  useEffect(() => _loadDatas(1), []);

  const _loadDatas = (page_: number, status_?: string) => {
    if (busy) return;
    setbusy(true);
    getWithdrawal(page_, status_ ?? status)
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
          <span className="text-[#4F8FE1] font-bold">Withdrawal Request</span> (
          {total})
        </div>
      </div>
      <div className="bg-[#010513] border-[1.5px] border-[#010513] mt-6 rounded-[16px] shadow-[0_0_8px_0_#4F8FE129] overflow-hidden">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          {/* <input
            placeholder="Search by Name, Email, or Wallet Address"
            className="border border-[#16263B] rounded-lg py-2 px-4 w-92 bg-[#0F1626]"
            style={{ backgroundImage: `url('${IC.lens}')` }}
            onChange={_search}
          /> */}
          <select
            className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
            onChange={_onFilterStatus}
            value={status}
          >
            <option value="">All Requiest</option>
            <option value="succes">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          {/* <select
            className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
          ></select> */}
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
              <div>{_it?.userId?.name || "null"}</div>
              <AddressT
                address={_it?.userId?.address}
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
            <div className={elSt + "w-[18%]"}>
              <StatusTags status={_it.status} />
            </div>
            <div className={elSt + "w-[20%] gap-2"}>
              {_it.status === "pending" && (
                <div className="bg-[#00B6761A] border border-[#00B6761A] w-8 h-8 rounded cursor-pointer flex">
                  <AproveBtn it={_it} done={() => _loadDatas(page)} />
                </div>
              )}
              {_it.status === "pending" && (
                <div className="bg-[#F93C651A] border border-[#F93C654D] w-8 h-8 rounded cursor-pointer flex">
                  <RejectBtn it={_it} done={() => _loadDatas(page)} />
                </div>
              )}
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

function AproveBtn({ it, done }: any) {
  const [on, seton] = useState(false);
  const [busy, setbusy] = useState(false);
  const [hash, sethash] = useState("");

  const _confirm = async () => {
    if (hash === "") return showErrorToast("Enter hash");
    setbusy(true);
    await aproveWithdraw(it._id, hash, "")
      .then(() => {
        seton(false);
        done();
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  return (
    <>
      <img
        src={IC.done}
        className="min-w-2 min-h-2 p-1 cursor-pointer"
        onClick={() => seton(true)}
      />
      <Popup1
        selected={on}
        className="p-8 max-w-[540px] w-full"
        close={() => seton(false)}
      >
        <img src={IC.succes} className="w-25" />
        <div className="text-[24px] mt-5 mb-7 font-[600]">
          Approve Withdrawal Request
        </div>
        <div className="text-[#C7CCD2] mb-2">
          Transaction Hash <span className="text-[#DF3A45]">*</span>
        </div>
        <input
          placeholder="Enter Txn Hash"
          className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
          value={hash}
          onChange={(e) => sethash(e.target.value)}
        />
        <div className="flex gap-4 mt-12">
          <button
            className={
              "ShadedBtn Black flex justify-center items-center rounded-full h-12 font-[600] w-full" +
              (busy ? " BusyBtn" : "")
            }
            onClick={() => seton(false)}
          >
            Cancel
          </button>
          <button
            className={
              "ShadedBtn flex justify-center items-center rounded-full h-12 font-[600] w-full" +
              (busy ? " BusyBtn" : "")
            }
            onClick={_confirm}
          >
            Confirm & Approve
          </button>
        </div>
      </Popup1>
    </>
  );
}

function RejectBtn({ it, done }: any) {
  const [on, seton] = useState(false);
  const [busy, setbusy] = useState(false);
  const [note, setnote] = useState("");

  const _rejects = async () => {
    setbusy(true);
    await rejectWithdraw(it._id, note)
      .then(() => {
        seton(false);
        done();
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  return (
    <>
      <img
        src={IC.closeRed}
        className="min-w-2 min-h-2 p-1 cursor-pointer"
        onClick={() => seton(true)}
      />
      <Popup1
        selected={on}
        className="p-8 max-w-[540px] w-full"
        close={() => seton(false)}
      >
        <img src={IC.error} className="w-25" />
        <div className="text-[24px] mt-5 mb-2 font-[600]">
          Reject Withdrawal Request
        </div>
        <div>
          Are you sure you want to reject this withdrawal request? This action
          cannot be undone.
        </div>
        <div className="text-[#C7CCD2] mt-8 mb-2">Note</div>
        <input
          placeholder="Enter reason"
          className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
          value={note}
          onChange={(e) => setnote(e.target.value)}
        />
        <div className="flex gap-4 mt-12">
          <button
            className={
              "ShadedBtn Black flex justify-center items-center rounded-full h-12 font-[600] w-full" +
              (busy ? " BusyBtn" : "")
            }
            onClick={() => seton(false)}
          >
            Cancel
          </button>
          <button
            className={
              "ShadedBtn flex justify-center items-center rounded-full h-12 font-[600] w-full" +
              (busy ? " BusyBtn" : "")
            }
            onClick={_rejects}
          >
            Reject Request
          </button>
        </div>
      </Popup1>
    </>
  );
}
