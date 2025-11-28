import { useEffect, useState } from "react";
import { AddressT } from "../../widgets/ethers";
import { IC } from "../../components/librery";
import { formatEther } from "../../services/simple";
import { Popup1 } from "../../layouts/popup";
import {
  createValidator,
  exportValidatorInvests,
  getValidators,
  updateValidator,
} from "../../services/validator";
import { isAddress } from "ethers";
import { showErrorToast } from "../../services/toast";
import { useNavigate } from "react-router-dom";

export default function ValidatorsPage() {
  const navigate = useNavigate();
  const [busy, setbusy] = useState(true);
  const [datas, setdatas] = useState([]);
  const [exportBusy, setexportBusy] = useState(false);

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

  const onClickExport = async () => {
    if (exportBusy) return;
    setexportBusy(true);
    await exportValidatorInvests();
    setexportBusy(false);
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <div className="flex justify-between items-center max-w-[1020px] w-full">
        <div className="font-bold font-[ClashDisplay] text-xl">
          Validators Server
        </div>
        <div className="flex gap-2">
          <div
            className={
              "ShadedBtn Black rounded-full py-2 px-6 font-bold" +
              (exportBusy ? " BusyBtn" : "")
            }
            onClick={onClickExport}
          >
            Export Investors
          </div>
          <EditValidator done={() => _loadDatas()} />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 max-w-[1020px] w-full mt-10">
        <div className="flex flex-col items-center w-full">
          {busy && <div className="text-center text-sm p-4">Loading...</div>}
          {datas.length < 1 && (
            <div className="text-center text-sm p-4">No Data</div>
          )}
        </div>
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
              <div
                className="min-w-13 h-13 cursor-pointer bg-gradient-to-r from-[#4F8FE1] to-[#256DC9] rounded-[50%] flex items-center justify-center"
                onClick={() => navigate(it._id)}
              >
                <img src={IC.eyeWhite} />
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between align-center">
                <div className="text-[18px]">Total Invested</div>
                <div className="text-[20px] font-[600]">
                  {formatNumber(formatEther(it.invested))}{" "}
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
                  <span className="text-[#4F8FE1]">{it.investors}</span>
                </div>
                <div>
                  {/* {formatNumber(
                    formatEther(
                      String(Number(it.capacity) - Number(it.invested))
                    )
                  )}{" "}
                  ICBX &nbsp;/&nbsp; */}
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
  const [capacity, setcapacity] = useState(
    String(formatEther(it?.capacity ?? "0"))
  );
  const [earned, setearned] = useState(String(formatEther(it?.earned ?? "0")));
  const [transferred, settransferred] = useState(
    String(formatEther(it?.transferred ?? "0"))
  );

  const isnew = it ? false : true;

  const _onSubmit = async () => {
    if (busy) return;

    if (name === "") return showErrorToast("Enter name");
    if (!isAddress(address)) return showErrorToast("Wrong address");
    if (capacity === "") return showErrorToast("Enter capacity");

    const body = { name, address, capacity, earned, transferred };

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

  const labelClass = "text-[#C7CCD2] text-sm mt-6 mb-1";
  const inputClass =
    "border border-[#16263B] bg-[#0F1626] rounded-[8px] py-3 px-4 w-full text-sm";

  return (
    <>
      <button
        className="ShadedBtn flex gap-2 justify-center items-center rounded-full py-2 font-[600] w-46"
        onClick={() => seton(true)}
      >
        <img src={isnew ? IC.plus : IC.edit} />
        {isnew ? "Add" : "Edit"} Validator
      </button>
      <Popup1
        selected={on}
        className="p-8 max-w-[460px] w-full"
        close={() => seton(false)}
      >
        <div className="text-[24px] mt-3 mb-1 font-[600]">
          {isnew ? "Add" : "Edit"} Validator
        </div>
        <div className={labelClass}>Validator Name</div>
        <input
          placeholder="e.g. validator server 1"
          className={inputClass}
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        <div className={labelClass}>Validator Wallet Address</div>
        <input
          placeholder="0x..."
          className={inputClass}
          value={address}
          onChange={(e) => setaddress(e.target.value)}
        />
        <div className={labelClass}>Capacity</div>
        <input
          placeholder="0.00"
          className={inputClass}
          value={capacity}
          onChange={(e) => setcapacity(e.target.value)}
        />
        <div className={labelClass}>Totel Earned</div>
        <input
          placeholder="0.00"
          className={inputClass}
          value={earned}
          onChange={(e) => setearned(e.target.value)}
        />
        <div className={labelClass}>Totel Transferd</div>
        <input
          placeholder="0.00"
          className={inputClass}
          value={transferred}
          onChange={(e) => settransferred(e.target.value)}
        />
        <div className="flex gap-4 mt-8">
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
            onClick={_onSubmit}
          >
            Save
          </button>
        </div>
      </Popup1>
    </>
  );
}
