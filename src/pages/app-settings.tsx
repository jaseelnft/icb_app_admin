import { useEffect, useState } from "react";
import { IC } from "../components/librery";
import {
  getTwitterPosts,
  getVerifideToken,
  updateTwitterPosts,
  updateVerifideToken,
} from "../services/settings";
import { showToast } from "../services/toast";

export default function AppSettingsPage() {
  return (
    <div className="h-full text-[#C7CCD2] p-8 flex flex-col gap-4">
      <VerifiedToken />
      <TwitterSetUp />
    </div>
  );
}

function VerifiedToken() {
  const [datas, setdatas] = useState([] as any[]);
  const [busy, setbusy] = useState(false);
  const [isAdd, setisAdd] = useState(false);
  const [name, setname] = useState("");
  const [address, setaddress] = useState("");

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
    d.push({ name: name.trim(), address: address.trim(), new: true });
    setdatas(d);
    setname("");
    setaddress("");
    setisAdd(false);
    return false;
  };

  const _onSave = async () => {
    if (busy) return;
    setbusy(true);
    setisAdd(false);
    await updateVerifideToken(datas)
      .then(() => {
        showToast("Verified token updated successfully");
        _loadData();
      })
      .catch(() => {});
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
      <div className="px-6 py-8">
        <div className="flex gap-4 flex-wrap">
          {datas.map((it, k) => (
            <div
              key={k}
              className="border border-[#16263B] rounded-lg p-2 pl-3 text-sm flex gap-2 items-center font-[500] bg-[#1A2A45]"
              style={{ background: it.new ? "transparent" : "" }}
            >
              <div>
                {it.name}
                <div className="text-xs opacity-80">{it.address}</div>
              </div>
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
            className="border border-[#16263B] rounded-lg p-4 w-232 flex gap-3"
            onSubmit={_onAdd}
          >
            <input
              placeholder="Token Name"
              className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0F1626] text-sm"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
            <input
              placeholder="Token Address"
              className="border border-[#16263B] rounded-lg py-2 px-4 w-100 bg-[#0F1626] text-sm"
              onChange={(e) => setaddress(e.target.value)}
              value={address}
            />
            <button
              className="ShadedBtn flex justify-center items-center rounded-full h-11 font-[600] w-46 text-sm"
              type="submit"
            >
              Add Token
            </button>
            <div
              className="ShadedBtn Black flex justify-center items-center rounded-full h-11 font-[600] w-46 text-sm"
              onClick={() => setisAdd(false)}
            >
              Cancel
            </div>
          </form>
        )}
        <div className="flex gap-2 mt-5">
          <div
            className={
              "ShadedBtn flex justify-center items-center rounded-full h-12 font-[600] w-46" +
              (busy ? " BusyBtn" : "")
            }
            onClick={_onSave}
          >
            Save Changes
          </div>
          <div
            className={
              "ShadedBtn Black flex justify-center items-center rounded-full h-12 font-[600] w-46" +
              (busy ? " BusyBtn" : "")
            }
            onClick={_onCancel}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}

function TwitterSetUp() {
  const [datas, setdatas] = useState([] as any[]);
  const [busy, setbusy] = useState(false);
  const [isAdd, setisAdd] = useState(false);
  const [name, setname] = useState("");
  const [id, setid] = useState("");

  useEffect(() => {
    _loadData();
  }, []);

  const _loadData = async () => {
    setisAdd(true);
    setdatas((await getTwitterPosts()) || []);
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
    d.push({ name: name.trim(), id: id.trim(), new: true });
    setdatas(d);
    setname("");
    setid("");
    setisAdd(false);
    return false;
  };

  const _onSave = async () => {
    if (busy) return;
    setbusy(true);
    setisAdd(false);
    await updateTwitterPosts(datas)
      .then(() => {
        showToast("Twitter posts updated successfully");
        _loadData();
      })
      .catch(() => {});
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
        <div className="font-[500] text-xl pb-1">Twitter Post</div>
        <div className="text-[15px]">
          Manage you witter post and fetch the reaction here
        </div>
      </div>
      <div className="px-6 py-8">
        <div className="flex gap-4 flex-wrap">
          {datas.map((it, k) => (
            <div
              key={k}
              className="border border-[#16263B] rounded-lg p-2 pl-3 text-sm flex gap-2 items-center font-[500] bg-[#1A2A45]"
              style={{ background: it.new ? "transparent" : "" }}
            >
              <div>
                {it.name}
                <div className="text-xs opacity-80">{it.id}</div>
              </div>
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
            + Add Post
          </div>
        )}
        {isAdd && (
          <form
            className="border border-[#16263B] rounded-lg p-4 w-232 flex gap-3"
            onSubmit={_onAdd}
          >
            <input
              placeholder="Post Name"
              className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0F1626] text-sm"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
            <input
              placeholder="Post Id"
              className="border border-[#16263B] rounded-lg py-2 px-4 w-100 bg-[#0F1626] text-sm"
              onChange={(e) => setid(e.target.value)}
              value={id}
            />
            <button
              className="ShadedBtn flex justify-center items-center rounded-full h-11 font-[600] w-46 text-sm"
              type="submit"
            >
              Add Post
            </button>
            <div
              className="ShadedBtn Black flex justify-center items-center rounded-full h-11 font-[600] w-46 text-sm"
              onClick={() => setisAdd(false)}
            >
              Cancel
            </div>
          </form>
        )}
        <div className="flex gap-2 mt-5">
          <div
            className={
              "ShadedBtn flex justify-center items-center rounded-full h-12 font-[600] w-46" +
              (busy ? " BusyBtn" : "")
            }
            onClick={_onSave}
          >
            Save Changes
          </div>
          <div
            className={
              "ShadedBtn Black flex justify-center items-center rounded-full h-12 font-[600] w-46" +
              (busy ? " BusyBtn" : "")
            }
            onClick={_onCancel}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}
