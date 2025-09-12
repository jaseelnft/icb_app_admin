import { useEffect, useState } from "react";
import { AddressT } from "../widgets/ethers";
import { IC } from "../components/librery";
import { formatEther } from "../services/simple";
import { Popup1 } from "../layouts/popup";
import {
  createValidator,
  getValidators,
  updateValidator,
} from "../services/validator";
import { isAddress } from "ethers";
import { showErrorToast } from "../services/toast";

export default function ValidatorsPage() {
  const [busy, setbusy] = useState(true);
  const [datas, setdatas] = useState([]);

  useEffect(() => _loadDatas(), []);

  const _loadDatas = () => {
    setbusy(true);
    getValidators()
      .then((res) => setdatas(res))
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  const formatNumber = (num: number) => {
    if (num === undefined || num === null) return "0";
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 10_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    } else {
      return num.toLocaleString();
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="flex justify-between items-center max-w-[1020px] w-full">
        <div className="font-bold font-[ClashDisplay] text-xl">
          Validators Server
        </div>
        {/* <button className="btn1" style={{ fontSize: 14, fontWeight: 400 }}>
          + Add New Validator
        </button> */}
        <EditValidator done={() => _loadDatas()} />
      </div>
      <div className="flex flex-wrap gap-5 max-w-[1020px] w-full mt-10">
        {busy && <div className="text-center text-sm p-4">Loading...</div>}
        {datas.length < 1 && (
          <div className="text-center text-sm p-4">No Data</div>
        )}
        {datas.map((it: any, k) => (
          <div
            key={k}
            className="border-[2px] border-[#AFD2FF33] min-w-[500px] rounded-[26px] bg-[#011022]"
          >
            <div className="bg-gradient-to-b from-[#0F2644] to-[#061C37] py-5 px-7 rounded-t-[24px] flex items-center">
              <div className="flex align-center justify-center bg-[#011022] rounded-[16px] min-w-[72px] h-[72px]">
                <img src={IC.validator_} className="w-[32px]" />
              </div>
              <div className="pl-4 w-[100%]">
                <div className="text-[#4F8FE1]">{it.name}</div>
                <AddressT
                  address={it.address}
                  className="text-white text-[20px]"
                />
              </div>
              <div className="min-w-13 h-13 cursor-pointer bg-gradient-to-r from-[#4F8FE1] to-[#256DC9] rounded-[50%] flex items-center justify-center">
                <img src={IC.eyeWhite} />
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between align-center">
                <div className="text-[18px]">Total Invested</div>
                <div className="text-[20px] font-[600]">
                  {/* {formatNumber(formatEther(it.invested))}{" "} */}
                  <span className="text-[#4F8FE1]">ICBX</span>
                </div>
              </div>
              <div className="h-3 bg-[#ffffff1a] rounded-[10px] flex mt-6">
                <div
                  className={`h-3 bg-gradient-to-r from-[#00BF76] to-[#5EE8AA] rounded-[10px]`}
                  style={{
                    width: `${(it.invested / it.capacity) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-6">
                <div className="text-[18px] font-[600] flex gap-2">
                  <img src={IC.usersWhite} /> Investors &nbsp;&nbsp;|
                  <span className="text-[#4F8FE1]">10</span>
                </div>
                <div>
                  {/* {formatNumber(formatEther(getFreeSpace(it) || "0"))} ICBX */}
                  &nbsp;/&nbsp;
                  {formatNumber(formatEther(it.capacity))} ICBX
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                {/* <InvestPop server={it} reload={_loadData} />
                      <WithdrawPop server={it} reload={_loadData} /> */}
              </div>
              <div className="flex justify-end mt-2">
                <EditValidator it={it} done={() => _loadDatas()} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditValidator({ it, done }: any) {
  const [on, seton] = useState(false);
  const [busy, setbusy] = useState(false);
  const [name, setname] = useState(it?.name ?? "");
  const [address, setaddress] = useState(it?.address ?? "");
  const [capacity, setcapacity] = useState(it?.capacity ?? "");

  const isnew = it ? false : true;

  const _onSubmit = async () => {
    if (busy) return;

    if (name === "") return showErrorToast("Enter name");
    if (!isAddress(address)) return showErrorToast("Wrong address");
    if (capacity === "") return showErrorToast("Enter capacity");

    const body = { name, address, capacity }; // TODO:

    setbusy(true);

    if (isnew)
      await createValidator(body)
        .then(() => {
          seton(false);
          done();
        })
        .catch(() => {})
        .finally(() => setbusy(false));
    else
      await updateValidator(it._id, body)
        .then(() => {
          seton(false);
          done();
        })
        .catch(() => {})
        .finally(() => setbusy(false));
  };

  return (
    <>
      <button className="btn1 flex gap-2" onClick={() => seton(true)}>
        <img src={isnew ? IC.plus : IC.edit} />
        {isnew ? "Add" : "Edit"} Validator
      </button>
      <Popup1
        selected={on}
        className="p-8 max-w-[540px] w-full"
        close={() => seton(false)}
      >
        <div className="text-[24px] mt-5 mb-2 font-[600]">
          {isnew ? "Add" : "Edit"} Validator
        </div>
        <div className="text-[#C7CCD2] mt-8 mb-2">Validator Name</div>
        <input
          placeholder="e.g. validator server 1"
          className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <div className="text-[#C7CCD2] mt-8 mb-2">Validator Wallet Address</div>
        <input
          placeholder="0x..."
          className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        />
        <div className="text-[#C7CCD2] mt-8 mb-2">Capacity</div>
        <input
          placeholder="0.00"
          className="border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-5 w-full"
          value={capacity}
          onChange={(e) => setcapacity(e.target.value)}
        />
        <div className="flex gap-4 mt-12">
          <button className="btn2 w-full" onClick={() => seton(false)}>
            Cancel
          </button>
          <button
            className={"btn1 w-full" + (busy ? " busybtn" : "")}
            onClick={_onSubmit}
          >
            Save
          </button>
        </div>
      </Popup1>
    </>
  );
}
