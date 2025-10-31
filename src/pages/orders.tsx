import { useEffect, useState } from "react";
import { aproveOrder, getUserOrders, rejectOrder } from "../services/orders";
import { IC } from "../components/librery";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { weiToICBX } from "../services/ethers";
import { StatusTags } from "../widgets/tags";
import { Paging } from "../components/paging";
import { formatDate } from "../services/simple";
import { Popup1 } from "../layouts/popup";
import { showErrorToast } from "../services/toast";

export default function OrdersPage() {
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
    await getUserOrders(page_, search_).then(async (res) => {
      setdatas(res.data);
      setpage(res.page);
      settotal(res.total);
    });
    setbusy(false);
  };

  const _search = (e: any) => {
    const value = e.target.value;
    setsearch(value);
    if (value.length > 2) loadDatas(1, value);
    else if (value.length === 0) loadDatas(1, "");
  };

  const elSt =
    "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold ">User Orders</span>
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
          <div className={elSt + "py-5 w-[34%]"}>Hash/Payment Id</div>
          <div className={elSt + "py-5 w-[22%] justify-end"}>USDT/ICBX</div>
          <div className={elSt + "py-5 w-[26%]"}>Created At</div>
          <div className={elSt + "py-5 w-[18%] justify-center"}>Status</div>
          <div className={elSt + "py-5 w-[18%] text-center"}>Action</div>
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
              className={elSt + "w-[22%] text-sm text-right flex-col items-end"}
            >
              <div>{_it.amount} USDT</div>
              {weiToICBX(_it.icbx ?? "0")} ICBX
            </div>
            <div className={elSt + "w-[26%] text-sm gap-1"}>
              <img src={IC.calender} className="w-[14px]" />
              {formatDate(_it.createdAt)}
            </div>

            <div className={elSt + "w-[18%] justify-center"}>
              <div className="capitalize mb-1 text-sm">{_it.type}</div>
              <StatusTags status={_it.status} />
            </div>
            <div className={elSt + "w-[18%] gap-2"}>
              {_it.status === "PENDING" && (
                <div className="bg-[#00B6761A] border border-[#00B6761A] w-8 h-8 rounded cursor-pointer flex">
                  <AproveBtn it={_it} done={() => loadDatas(page, search)} />
                </div>
              )}
              {_it.status === "PENDING" && (
                <div className="bg-[#F93C651A] border border-[#F93C654D] w-8 h-8 rounded cursor-pointer flex">
                  <RejectBtn it={_it} done={() => loadDatas(page, search)} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <Paging
        total={total}
        page={page}
        reload={(a1: any) => loadDatas(a1, search)}
      />
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
    await aproveOrder(it._id, hash, "")
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
        <div className="flex flex-col items-center">
          <img src={IC.succes} className="w-25" />
          <div className="text-[24px] mt-5 mb-7 font-[600]">
            Approve Order Request
          </div>
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
    await rejectOrder(it._id, note)
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
        <div className="flex flex-col items-center">
          <img src={IC.error} className="w-25" />
          <div className="text-[24px] mt-5 mb-2 font-[600]">
            Reject Withdrawal Request
          </div>
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
