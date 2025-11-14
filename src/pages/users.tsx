import { useEffect, useState } from "react";
import { getUsers } from "../services/dashboard";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import { IC } from "../components/librery";
import { weiToICBX } from "../services/ethers";
import { Paging } from "../components/paging";
import { useSelector } from "react-redux";
import { setUsers, store } from "../redux/store";
import { Drower1 } from "../layouts/popup";
import { AppSearch } from "../components/input";

export default function UsersPage() {
  const [selcted, setselcted]: any = useState(null);
  const [localBusy, setlocalBusy] = useState(false);
  const [search, setsearch] = useState("");

  const { total, page, data, busy } = useSelector(
    (state: any) => state.data.users
  );

  useEffect(() => {
    _loadDatas(page, "");
  }, []);

  const _changePage = (a1: any) => {
    store.dispatch(setUsers({ total, page: a1, data: [], busy: true }));
    _loadDatas(a1, search);
  };

  const _loadDatas = async (page_: number, search_: string) => {
    await getUsers(page_, search_);
    setlocalBusy(false);
  };

  const _search = (value: string) => {
    setsearch(value);
    setlocalBusy(true);
    if (value.length > 2) _loadDatas(1, value);
    else if (value.length === 0) _loadDatas(1, "");
  };

  // const onFilter = (value: string) => {
  //   if (value === "") _loadDatas(1, "");
  //   else {

  //   }
  // };

  const elSt =
    "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <div className="text-xl">
          <span className="text-[#4F8FE1] font-bold ">Platform Users</span> (
          {total})
        </div>
      </div>
      <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px] overflow-hidden">
        <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
          <AppSearch
            onChange={_search}
            hint="Search by User, Email, or Wallet Address"
          />
          {/* <AppFilter
            onChange={onFilter}
            list={[
              { name: "All", value: "" },
              { name: "Investors", value: "investors" },
            ]}
          /> */}
        </div>
        <div className="flex text-[14px] px-2">
          <div className="min-w-16" />
          <div className={elSt + "py-5 w-[40%]"}>User</div>
          <div className={elSt + "py-5 w-[34%]"}>Wallet Address / WICBX</div>
          <div className={elSt + "py-5 w-[26%] justify-end"}>Validator</div>
          <div className={elSt + "py-5 w-[26%] justify-end"}>ICBX Balance</div>
          <div className={elSt + "py-5 w-40 justify-center"}>Action</div>
        </div>
        {(busy || localBusy) && (
          <div className="text-center text-sm p-4">Loading...</div>
        )}
        {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
        {data.map((_it: any, k: number) => (
          <div className="flex odd:bg-[#0a101d] px-2" key={k}>
            <div className="py-4 pl-4 min-w-16 flex justify-center">
              <EthereumBlockie address={_it.address} size={36} />
            </div>
            <div className={elSt + "w-[40%]"}>
              <div>
                <div>{_it.name || "null"}</div>
                <div className="text-[#256DC9] text-sm">
                  {_it.email || "null"}
                </div>
              </div>
            </div>

            <div
              className={
                elSt + "w-[34%] text-[#B3BDCB] text-sm flex-col items-start"
              }
            >
              <AddressT address={_it.address} iconSize={20} />
              <b style={(_it.wicbx ?? "0") > 0 ? { color: "orange" } : {}}>
                {weiToICBX(_it.wicbx ?? "0")} ICBX
              </b>
            </div>

            <div
              className={
                elSt +
                "w-[26%] text-[#A5A7AA] text-sm flex-col items-end justify-center"
              }
            >
              {(_it?.validator?.countAll || 0) === 0 ? (
                <span className="text-[#DF3A45]">Not Invested</span>
              ) : (
                <>
                  {weiToICBX(_it.validator.total ?? "0")} ICBX
                  <div>
                    <b>{_it.validator.count}</b>/{_it.validator.countAll}
                  </div>
                </>
              )}
            </div>
            {_it.done ? (
              <div className={elSt + "w-[26%] text-sm items-end flex-col"}>
                {weiToICBX(_it.icbx ?? "0")} ICBX
                {_it.haveKYC ? (
                  <div className="flex gap-2 items-center text-[#00B676]">
                    <div className="w-2 h-2 rounded-[4px] bg-[#00B676]" />
                    KYC Verified
                  </div>
                ) : (
                  <div className="flex gap-2 items-center text-[#DF3A45]">
                    <div className="w-2 h-2 rounded-[4px] bg-[#DF3A45]" />
                    KYC Not Verified
                  </div>
                )}
              </div>
            ) : (
              <div className={elSt + "w-[26%] text-sm justify-end"}>
                Loading..
              </div>
            )}

            <div className={elSt + "w-40 justify-center gap-1"}>
              {/* <img
                src={IC.close}
                className="bg-[#FFFFFF1A] border border-[#FFFFFF4D] w-8 h-8 min-w-2 min-h-2 p-[5px] rounded cursor-pointer filter invert-[0.45] sepia-[0.9] hue-rotate-[-5deg] saturate-[4]"
              /> */}
              <img
                src={IC.eye}
                onClick={() => setselcted(_it)}
                className="bg-[#4F8FE11A] border border-[#4F8FE14D] w-8 h-8 min-w-2 min-h-2 p-[5px] rounded cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
      <Paging total={total} page={page} reload={_changePage} />
      <Drower1
        on={selcted !== null}
        close={() => setselcted(null)}
        title={selcted?.name || ""}
      >
        {selcted && (
          <div className="p-5 py-8">
            <div className="flex items-center gap-3 mb-6 mx-2">
              <EthereumBlockie address={selcted.address} size={86} />
              <div>
                <div className="text-lg font-bold">
                  {selcted.name || "null"}
                </div>
                <div className="text-[#256DC9] text-sm">
                  {selcted.email || "null"}
                </div>
                <AddressT address={selcted.address} iconSize={20} />
              </div>
            </div>
            <div className="bg-[#010513] rounded-[10px] border border-[#16263B] p-4 text-sm">
              <div className="flex justify-between py-2">
                <div>ICBX</div>
                <div className="font-bold">
                  {weiToICBX(selcted.icbx ?? "0")} ICBX
                </div>
              </div>
              <div className="flex justify-between py-2">
                <div>ICB KYC</div>
                {selcted.haveKYC ? (
                  <div className="flex gap-2 items-center text-[#00B676]">
                    <div className="w-2 h-2 rounded-[4px] bg-[#00B676]" />
                    KYC Verified
                  </div>
                ) : (
                  <div className="flex gap-2 items-center text-[#DF3A45]">
                    <div className="w-2 h-2 rounded-[4px] bg-[#DF3A45]" />
                    KYC Not Verified
                  </div>
                )}
              </div>
              <div className="flex justify-between py-2">
                <div>WICBX</div>
                <div className="font-bold">
                  {weiToICBX(selcted.wicbx ?? "0")} ICBX
                </div>
              </div>
              <div className="flex justify-between py-2">
                Totel Invested
                <div className="font-bold">
                  {weiToICBX(selcted.validator.total ?? "0")} ICBX
                </div>
              </div>
              <div className="flex justify-between py-2">
                Invest Count (Acive/Totel)
                <div className="font-bold">
                  <div>
                    <b>{selcted.validator.count}</b>/
                    {selcted.validator.countAll}
                  </div>
                </div>
              </div>
            </div>
            {/* <div>
              <div className="flex text-[14px] bg-[black]">
                <div className={elSt + "py-4 w-[60%]"}>Address</div>
                <div className={elSt + "py-4 w-[40%]"}>Status</div>
              </div>
              {(busy || localBusy) && (
                <div className="text-center text-sm p-4">Loading...</div>
              )}
              {total < 1 && (
                <div className="text-center text-sm p-4">No Data</div>
              )}
            </div> */}
          </div>
        )}
      </Drower1>
    </div>
  );
}
