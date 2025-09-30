import { useEffect, useState } from "react";
import { IC } from "../components/librery";
import { getVerifideToken, updateVerifideToken } from "../services/settings";
import { showToast } from "../services/toast";

export default function AppSettingsPage() {
  return (
    <div className="h-full text-[#C7CCD2] p-8">
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#e3e3e3"
      >
        <path d="M756-120 537-339l84-84 219 219-84 84Zm-552 0-84-84 276-276-68-68-28 28-51-51v82l-28 28-121-121 28-28h82l-50-50 142-142q20-20 43-29t47-9q24 0 47 9t43 29l-92 92 50 50-28 28 68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q15 0 28.5 3t27.5 9l-99 99 72 72 99-99q7 14 9.5 27.5T841-701q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L204-120Z" />
      </svg>
      &nbsp; App Settings Page Under Development */}
      <VerifiedToken />
    </div>
  );
}

function VerifiedToken() {
  const [datas, setdatas] = useState([] as any[]);
  const [busy, setbusy] = useState(false);
  const [isAdd, setisAdd] = useState(false);
  const [name, setname] = useState("");

  useEffect(() => {
    _loadData();
  }, []);

  const _loadData = async () => {
    setisAdd(true);
    setdatas((await getVerifideToken()) || []);
    setisAdd(false);
  };

  const _onRemove = (i: number) => {
    let d = [...datas];
    d.splice(i, 1);
    setdatas(d);
  };

  const _onAdd = (e: any) => {
    e.preventDefault();
    if (busy || name.trim() === "") return;
    let d = [...datas];
    d.push({ name: name.trim(), new: true });
    setdatas(d);
    setname("");
    setisAdd(false);
    return false;
  };

  const _onSave = async () => {
    if (busy) return;
    setbusy(true);
    setisAdd(false);
    await updateVerifideToken(datas).then(() => {
      showToast("Verified token updated successfully");
      _loadData();
    });

    setbusy(false);
  };

  const _onCancel = () => {
    if (busy) return;
    _loadData();
    setisAdd(false);
  };

  return (
    <div className="border-[1.5px] border-[#16263B] rounded-[24px] overflow-hidden bg-[#011022]">
      <div className="bg-[#010513] px-7 py-6">
        <div className="font-[500] text-xl pb-1">Edit Verified Token</div>
        <div className="text-[15px]">
          Easily configure and update withdrawal rules and app details.
        </div>
      </div>
      <div className="px-6 py-10">
        <div className="flex gap-4">
          {datas.map((it, k) => (
            <div
              key={k}
              className="mb-4 border border-[#16263B] rounded-lg p-2 pl-3 text-sm flex gap-2 items-center font-[500] bg-[#1A2A45]"
              style={{ background: it.new ? "transparent" : "" }}
            >
              {it.name}
              <img
                src={IC.closeRed}
                className="cursor-pointer w-5 bg-[#010513] rounded"
                onClick={() => _onRemove(k)}
              />
            </div>
          ))}
        </div>
        {!isAdd && (
          <div
            className="text-[#4F8FE1] font-[500] cursor-pointer p-1 my-2"
            onClick={() => setisAdd(true)}
          >
            + Add Token
          </div>
        )}
        {isAdd && (
          <form
            className="border border-[#16263B] rounded-lg p-4 w-150 flex gap-3"
            onSubmit={_onAdd}
          >
            <input
              placeholder="Token Name"
              className="border border-[#16263B] rounded-lg py-2 px-4 w-80 bg-[#0F1626]"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />

            <button
              className="btn1 w-64 text-center"
              style={{ padding: 11 }}
              type="submit"
            >
              Add Token
            </button>
            <div
              className="btn2 w-64 text-center"
              style={{ padding: 11 }}
              onClick={() => setisAdd(false)}
            >
              Cancel
            </div>
          </form>
        )}
        <div className="flex gap-2 mt-5">
          <div
            className={"btn1 w-52 text-center " + (busy ? "busybtn" : "")}
            style={{ padding: 11 }}
            onClick={_onSave}
          >
            Save Changes
          </div>
          <div
            className={"btn2 w-52 text-center " + (busy ? "busybtn" : "")}
            style={{ padding: 11 }}
            onClick={_onCancel}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
