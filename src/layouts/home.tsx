import { StrictMode, useEffect, useState } from "react";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { IC, Logo } from "../components/librery";
import { Drower1, Popup1 } from "./popup";
import { APP_VERSION, appLogOut, connectWs } from "../services/config";
import {
  gatUserStakingInvests,
  gatUserValitatorInvests,
  getDetails,
  getUserDetails,
  getUserRandomWallets,
  getUserTxns,
  getUserWallets,
} from "../services/dashboard";
import LoadingPage from "../components/loadingPage";
import { AddressT, EthereumBlockie } from "../widgets/ethers";
import {
  bigToString,
  gatEthBalance,
  haveKYCNFT,
  weiToICBX,
} from "../services/ethers";
import { formatDate, formatEther, formatICBX } from "../services/simple";
import { Paging1 } from "../components/paging";
import { makeTxnType } from "../pages/transactions";
import { StatusTags } from "../widgets/tags";
import { makeStakeStatus } from "../pages/staking";

export default function HomeLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [busy, setbusy] = useState(true);
  const [main, setmain] = useState("MAIN");

  const menus = [
    {
      title: "MAIN",
      list: [
        {
          title: "Dashboard",
          path: "",
          icOff: IC.dashboard,
          icOn: IC.dashboard_,
        },
        { title: "Users", path: "users", icOff: IC.users, icOn: IC.users_ },
        {
          title: "Reward Logs",
          path: "reward-logs",
          icOff: IC.trophy,
          icOn: IC.trophy_,
        },
        {
          title: "Support",
          path: "support",
          icOff: IC.support,
          icOn: IC.support_,
        },
      ],
    },
    {
      title: "WICBX",
      list: [
        {
          title: "Withdraw Request",
          path: "withdraw-requests",
          icOff: IC.withdraw,
          icOn: IC.withdraw_,
        },
        {
          title: "Random Wallets",
          path: "random-wallets",
          icOff: IC.payments,
          icOn: IC.payments_,
        },
        {
          title: "Transactions",
          path: "transactions",
          icOff: IC.card,
          icOn: IC.card_,
        },
      ],
    },
    {
      title: "VALIDATOR",
      list: [
        {
          title: "Validator",
          path: "validator",
          icOff: IC.validator,
          icOn: IC.validator_,
        },
      ],
    },
    {
      title: "STAKING",
      list: [
        {
          title: "Staking",
          path: "staking",
          icOff: IC.staking,
          icOn: IC.staking_,
        },
      ],
    },
    {
      title: "SALES",
      list: [
        { title: "Orders", path: "orders", icOff: IC.sell, icOn: IC.sell_ },
        {
          title: "Payments",
          path: "payments",
          icOff: IC.payments,
          icOn: IC.payments_,
        },
      ],
    },
    {
      title: "SETTINGS",
      list: [
        {
          title: "App Settings",
          path: "app-settings",
          icOff: IC.gear,
          icOn: IC.gear_,
        },
        { title: "Admins", path: "admins", icOff: IC.users, icOn: IC.users_ },
      ],
    },
  ];

  useEffect(() => {
    for (const it of menus)
      if (
        it.list.some(
          (it1) => it1.path === pathname?.toLowerCase()?.split("/")?.[1]
        )
      )
        setmain(it.title);
  }, [pathname]);

  useEffect(() => {
    getDetails()
      .then(() => {})
      .catch(() => {})
      .finally(() => setbusy(false));
    connectWs();
  }, []);

  const eachSide = (title: string, value: string, i1: string, i2: string) => {
    return (
      <div
        key={value}
        className={`mt-2 px-4 h-12 text-[14px] text-[#A5A7AA] flex items-center cursor-pointer relative w-full ${
          pathname === `/${value}` ? "rounded rounded-[8px] bg-[#0E1C2F]" : ""
        }`}
        onClick={() => navigate(value)}
      >
        <img className="w-4 mr-3" src={pathname === `/${value}` ? i2 : i1} />
        <div className={pathname === `/${value}` ? "text-[#4F8FE1]" : ""}>
          {title}
        </div>
      </div>
    );
  };

  const mainSet = (v: string, l: any[]) => {
    return (
      <StrictMode key={v}>
        <div
          key={v}
          className="text-[11px] text-[#C7CCD2] px-3 py-3 font-[600] cursor-pointer flex justify-between"
          style={v === main ? { color: "#4F8FE1" } : {}}
          onClick={() => setmain(v)}
        >
          {v}
          <img
            src={IC.dropArrow}
            className="w-2"
            style={v === main ? { display: "none" } : {}}
          />
        </div>
        <div
          className="max-h-0 transition-all duration-300 ease-in-out overflow-hidden"
          style={v === main ? { maxHeight: 800 } : {}}
        >
          {l}
          <div className="my-5" />
          {/* <div className="bg-[#16263B] h-[2px] my-4" /> */}
        </div>
      </StrictMode>
    );
  };

  if (busy) return <LoadingPage />;

  return (
    <div className="flex w-full h-[100vh] overflow-hidden">
      <div className="w-65 min-w-65 bg-[#011022] p-6 border-r border-[#FFFFFF1A] flex flex-col justify-between items-center hidden lg:flex">
        <div className="w-full">
          <img src={Logo.appFull} className="h-15" />
          <div className="bg-gradient-to-r from-[#101B2D] to-[#182842]" />
          <div className="h-[2px] w-full bg-gradient-to-r from-[#011022] via-[#3D6FAE] to-[#011022] mt-5 mb-8"></div>
          {menus.map((it) =>
            mainSet(
              it.title,
              it.list.map((it1) =>
                eachSide(it1.title, it1.path, it1.icOff, it1.icOn)
              )
            )
          )}
        </div>
        <div className="w-[80%]">
          <Logout />
          <br />
          <div className="text-center text-[13px]">
            Developed by ICB Lab, v{APP_VERSION}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center bg-gradient-to-b from-[#101B2D] via-[#142442] to-[#101B2D]">
        <div className="w-full h-22 bg-[#010513] flex justify-between items-center">
          <div className="font-[ClashDisplay] px-6 text-[18px]">
            {pathname === `/` && "Dashboard"}
            {pathname === `/users` && "Users"}
            {pathname === `/validator` && "Validators"}
            {pathname === `/withdraw-requests` && "Withdraw Requests"}
            {pathname === `/reward-logs` && "Reward Logs"}
            {pathname === `/random-wallets` && "Random Wallets"}
            {pathname === `/transactions` && "Transactions"}
            {pathname === `/staking` && "Staking"}
            {pathname === `/support` && "Support"}
            {pathname === `/orders` && "Orders"}
            {pathname === `/payments` && "Payments"}
            {pathname === `/app-settings` && "App Settings"}
            {pathname === `/admins` && "Admins"}
          </div>
        </div>
        <div className=" w-full h-[calc(100vh-168px)] md:h-[calc(100vh-88px)] overflow-y-auto">
          <Outlet />
        </div>
        <div className="fixed left-0 bottom-0 right-0 h-20 bg-[#010513] md:hidden flex justify-evenly items-center">
          <img
            className="p-3 w-12 h-12"
            alt="dashboard"
            src={IC.dashboard}
            onClick={() => navigate("/")}
          />
          <img
            className="p-3 w-12 h-12"
            alt="users"
            src={IC.users}
            onClick={() => navigate("/users")}
          />
          <img
            className="p-3 w-12 h-12"
            alt="gear"
            src={IC.gear}
            onClick={() => navigate("/app-settings")}
          />
        </div>
      </div>
      <UserDrawer />
    </div>
  );
}

function Logout() {
  const navigate = useNavigate();
  const [selected, setselected] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-3 rounded-[28px] px-4 py-2 bg-[#256DC9] cursor-pointer"
        onClick={() => setselected(true)}
      >
        <img src={IC.logout} />
        Logout
      </div>
      <Popup1 selected={selected} close={() => setselected(false)}>
        <div className="w-[460px] p-10 flex flex-col items-center text-center">
          <img src={IC.logout1} />
          <div className="text-[22px] font-semibold pt-8 pb-4">
            Log out of your account?
          </div>
          <div>
            You’ll be signed out of your account and need to log in again.
          </div>
          <br /> <br />
          <div className="flex gap-[22px]">
            <button
              className="ShadedBtn Black rounded-full h-13 font-[600] w-48"
              onClick={() => setselected(false)}
            >
              Cancel
            </button>
            <button
              className="ShadedBtn rounded-full h-13 font-[600] w-48"
              onClick={() => {
                navigate("/auth/login");
                appLogOut();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </Popup1>
    </>
  );
}

function UserDrawer() {
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [busy, setbusy] = useState(false);
  const [busyBC, setbusyBC] = useState(false);

  const initT1 = { busy: false, loaded: false, data: [] };
  const initT2 = { busy: false, loaded: false, data: [], page: 1, total: 0 };
  const [wallet, setwallet] = useState(initT1);
  const [randomWallet, setrandomWallet] = useState(initT1);
  const [txns, settxns] = useState(initT2);
  const [vInvests, setvInvests] = useState(initT2);
  const [sInvests, setsInvests] = useState(initT2);

  const userId = new URLSearchParams(search).get("user") ?? "";

  const [user, setuser]: any = useState({});

  const onClose = () => {
    searchParams.delete("user");
    setSearchParams(searchParams);
    setwallet(initT1);
    setrandomWallet(initT1);
    settxns(initT2);
    setvInvests(initT2);
    setsInvests(initT2);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    if (userId === "" || busy) return;
    setuser(null);
    setbusy(true);
    setbusyBC(true);
    await getUserDetails(userId)
      .then(async (res: any) => {
        let icbx = "0";
        let haveKYC = false;
        setuser({ ...res, icbx, haveKYC });
        setbusy(false);
        await gatEthBalance(res.address).then(
          (res) => (icbx = bigToString(res))
        );
        await haveKYCNFT(res.address).then((res) => (haveKYC = res));
        setuser({ ...res, icbx, haveKYC });
        setbusyBC(false);
      })
      .catch(() => {});
  };

  const loadWallets = () => {
    if (wallet.loaded || wallet.busy) return;
    setwallet({ ...initT1, busy: true });
    getUserWallets(userId)
      .then((res) => setwallet({ loaded: true, busy: false, data: res }))
      .catch(() => {});
  };

  const loadRandomWallets = () => {
    if (randomWallet.loaded || randomWallet.busy) return;
    setrandomWallet({ ...initT1, busy: true });
    getUserRandomWallets(userId)
      .then((res) => setrandomWallet({ loaded: true, busy: false, data: res }))
      .catch(() => {});
  };

  const loadTxns = (page: any) => {
    if (txns.loaded || txns.busy) return;
    settxns({ ...initT2, busy: true });
    getUserTxns(userId, page)
      .then((res) => settxns({ loaded: true, busy: false, ...res }))
      .catch(() => {});
  };

  const loadValitatorInvests = (page: any) => {
    if (vInvests.loaded || vInvests.busy) return;
    setvInvests({ ...initT2, busy: true });
    gatUserValitatorInvests(userId, page)
      .then((res) => setvInvests({ loaded: true, busy: false, ...res }))
      .catch(() => {});
  };

  const loadStakingInvests = (page: any) => {
    if (sInvests.loaded || sInvests.busy) return;
    setsInvests({ ...initT2, busy: true });
    gatUserStakingInvests(userId, page)
      .then((res) => setsInvests({ loaded: true, busy: false, ...res }))
      .catch(() => {});
  };

  return (
    <Drower1 on={userId !== ""} close={onClose} title={user?.name || ""}>
      {busy ? (
        <div className="text-center p-4">Loading...</div>
      ) : (
        <div className="p-4 py-8">
          <div className="flex items-center gap-3 mb-6 mx-2">
            <EthereumBlockie address={user.address} size={86} />
            <div>
              <div className="text-lg font-bold">{user.name || "null"}</div>
              <div className="text-[#256DC9] text-sm">
                {user.email || "null"}
              </div>
              <AddressT address={user.address} iconSize={20} />
            </div>
          </div>
          <div className="bg-[#010513] rounded-[10px] border border-[#16263B] p-4 text-sm">
            <div className="flex justify-between py-2">
              <div>ICBX</div>
              <div className="font-bold">
                {busyBC ? "Loading.." : `${weiToICBX(user.icbx ?? "0")} ICBX`}
              </div>
            </div>
            <div className="flex justify-between py-2">
              <div>ICB KYC</div>
              {user.haveKYC ? (
                <div className="flex gap-2 items-center text-[#00B676]">
                  <div className="w-2 h-2 rounded-[4px] bg-[#00B676]" />
                  KYC Verified
                </div>
              ) : (
                <div className="flex gap-2 items-center text-[#DF3A45]">
                  <div className="w-2 h-2 rounded-[4px] bg-[#DF3A45]" />
                  {busyBC ? "Loading.." : "KYC Not Verified"}
                </div>
              )}
            </div>
            <div className="flex justify-between py-2">
              <div>WICBX</div>
              <div className="font-bold">
                {weiToICBX(user.wicbx ?? "0")} ICBX
              </div>
            </div>
            <div className="flex justify-between py-2">
              Totel in Validator
              <div className="font-bold">
                {weiToICBX(user?.validator?.total ?? "0")} ICBX
              </div>
            </div>
            <div className="flex justify-between py-2">
              Invest Count (Acive/Totel)
              <div className="font-bold">
                <div>
                  <b>{user?.validator?.count}</b>/{user?.validator?.countAll}
                </div>
              </div>
            </div>
            <div className="flex justify-between py-2">
              Staking (Acive/Totel)
              <div className="font-bold">
                <div>
                  <b>{user?.staking?.count}</b>/{user?.staking?.countAll}
                </div>
              </div>
            </div>
          </div>

          <div className="my-2 bg-[#010513] rounded-[10px] border border-[#16263B] text-sm overflow-hidden">
            <div
              className="flex justify-between item-center p-4"
              onClick={loadWallets}
            >
              <div className="font-bold">
                User Wallets
                {wallet.busy && (
                  <span className="text-center text-sm text-[#C7CCD299] font-[400]">
                    &nbsp;Loading...
                  </span>
                )}
              </div>
              {!wallet.loaded && <img src={IC.dropArrow} alt="A" />}
            </div>

            <div className={wallet.loaded ? "" : " hidden"}>
              <div className="flex font-[500] px-4 pb-4">
                <div className="w-[8%]" />
                <div className="w-[40%]">Name</div>
                <div className="w-[60%]">Address</div>
              </div>

              {wallet.data.length < 1 && (
                <div className="text-center text-sm pb-4 text-[#C7CCD299]">
                  No extra wallets added
                </div>
              )}
              {wallet.data.map((it: any, k) => (
                <div className="flex even:bg-[#011022aa] px-4 py-3" key={k}>
                  <div className="w-[8%]">{k + 1}</div>
                  <div className="w-[40%]">{it.name}</div>
                  <div className="w-[60%]">
                    <AddressT address={it.address} iconSize={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="my-2 bg-[#010513] rounded-[10px] border border-[#16263B] text-sm overflow-hidden">
            <div
              className="flex justify-between item-center p-4"
              onClick={loadRandomWallets}
            >
              <div className="font-bold">
                User Random Wallets
                {randomWallet.busy && (
                  <span className="text-center text-sm text-[#C7CCD299] font-[400]">
                    &nbsp;Loading...
                  </span>
                )}
              </div>
              {!randomWallet.loaded && <img src={IC.dropArrow} alt="A" />}
            </div>
            <div className={randomWallet.loaded ? "" : " hidden"}>
              <div className="flex font-[500] px-4 pb-4">
                <div className="w-[8%]" />
                <div className="w-[20%] text-center">Index</div>
                <div className="w-[60%]">Address</div>
                <div className="w-[16%]">Scan</div>
              </div>
              {randomWallet.data.length < 1 && (
                <div className="text-center text-sm pb-4 text-[#C7CCD299]">
                  Not generated random wallets
                </div>
              )}
              {randomWallet.data.map((it: any, k) => (
                <div className="flex even:bg-[#011022aa] px-4 py-3" key={k}>
                  <div className="w-[8%]">{k + 1}</div>
                  <div className="w-[20%] text-center">{it.index}</div>
                  <div className="w-[60%]">
                    <AddressT address={it.address} iconSize={20} />
                  </div>
                  <div
                    className="w-[16%] text-[#4F8FE1] cursor-pointer"
                    onClick={() =>
                      window.open("https://icbscan.io/address/" + it.address)
                    }
                  >
                    Scan
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-2 bg-[#010513] rounded-[10px] border border-[#16263B] text-sm overflow-hidden">
            <div
              className="flex justify-between item-center p-4"
              onClick={() => loadTxns(1)}
            >
              <div className="font-bold">
                User Transactions{txns.loaded && `(${txns.total})`}
                {txns.busy && (
                  <span className="text-center text-sm text-[#C7CCD299] font-[400]">
                    &nbsp;Loading...
                  </span>
                )}
              </div>
              {!txns.loaded && <img src={IC.dropArrow} alt="A" />}
            </div>
            <div className={txns.loaded ? "" : " hidden"}>
              <div className="flex font-[500] px-4 pb-4">
                <div className="w-[42%]">Amount</div>
                <div className="w-[32%] text-center">Type</div>
                <div className="w-[32%] text-center">Status</div>
              </div>
              {txns.data.length < 1 && (
                <div className="text-center text-sm pb-4 text-[#C7CCD299]">
                  No transactions found
                </div>
              )}
              {txns.data.map((it: any, k) => (
                <div
                  className="flex items-center even:bg-[#011022aa] px-4 py-3"
                  key={k}
                >
                  <div className="w-[42%]">
                    {formatICBX(formatEther(it.amount || 0))} WICBX
                  </div>
                  <div className="w-[32%] flex justify-center">
                    {makeTxnType(it.type)}
                  </div>
                  <div className="w-[32%] flex justify-center">
                    <StatusTags status={it.status} />
                  </div>
                </div>
              ))}
            </div>
            <Paging1 total={txns.total} page={txns.page} reload={loadTxns} />
          </div>
          <div className="my-2 bg-[#010513] rounded-[10px] border border-[#16263B] text-sm overflow-hidden">
            <div
              className="flex justify-between item-center p-4"
              onClick={() => loadValitatorInvests(1)}
            >
              <div className="font-bold">
                Validator Invests
                {vInvests.loaded && `(${vInvests.total})`}
                {vInvests.busy && (
                  <span className="text-center text-sm text-[#C7CCD299] font-[400]">
                    &nbsp;Loading...
                  </span>
                )}
              </div>
              {!vInvests.loaded && <img src={IC.dropArrow} alt="A" />}
            </div>
            <div className={vInvests.loaded ? "" : " hidden"}>
              <div className="flex font-[500] px-4 pb-4">
                <div className="w-[42%]">Amount</div>
                <div className="w-[32%] text-center">Invested On</div>
                <div className="w-[32%] text-center">Status</div>
              </div>
              {vInvests.data.length < 1 && (
                <div className="text-center text-sm pb-4 text-[#C7CCD299]">
                  No validator invesment found
                </div>
              )}
              {vInvests.data.map((it: any, k) => (
                <div
                  className="flex items-center even:bg-[#011022aa] px-4 py-3"
                  key={k}
                >
                  <div className="w-[42%]">
                    {formatICBX(formatEther(it.amount || 0))} WICBX
                  </div>
                  <div className="w-[32%] text-center text-xs">
                    {formatDate(it.createdAt)}
                  </div>
                  <div className="w-[32%] flex justify-center">
                    <StatusTags status={it.active ? "ACTIVE" : "NOT_ACTIVE"} />
                  </div>
                </div>
              ))}
            </div>
            <Paging1
              total={vInvests.total}
              page={vInvests.page}
              reload={loadValitatorInvests}
            />
          </div>
          <div className="my-2 bg-[#010513] rounded-[10px] border border-[#16263B] text-sm overflow-hidden">
            <div
              className="flex justify-between item-center p-4"
              onClick={() => loadStakingInvests(1)}
            >
              <div className="font-bold">
                Stake Invests{sInvests.loaded && `(${sInvests.total})`}
                {sInvests.busy && (
                  <span className="text-center text-sm text-[#C7CCD299] font-[400]">
                    &nbsp;Loading...
                  </span>
                )}
              </div>
              {!sInvests.loaded && <img src={IC.dropArrow} alt="A" />}
            </div>
            <div className={sInvests.loaded ? "" : " hidden"}>
              <div className="flex font-[500] px-4 pb-4">
                <div className="w-[42%]">Amount</div>
                <div className="w-[32%] text-center">Invested On</div>
                <div className="w-[32%] text-center">Status</div>
              </div>
              {sInvests.data.length < 1 && (
                <div className="text-center text-sm pb-4 text-[#C7CCD299]">
                  No staking investment found
                </div>
              )}
              {sInvests.data.map((it: any, k) => (
                <div
                  className="flex items-center even:bg-[#011022aa] px-4 py-3"
                  key={k}
                >
                  <div className="w-[42%]">
                    {formatICBX(formatEther(it.invested || 0))} WICBX
                  </div>
                  <div className="w-[32%] text-center text-xs">
                    {formatDate(it.createdAt)}
                  </div>
                  <div className="w-[32%] flex justify-center">
                    {makeStakeStatus(it?.status || "")}
                  </div>
                </div>
              ))}
            </div>
            <Paging1
              total={sInvests.total}
              page={sInvests.page}
              reload={loadStakingInvests}
            />
          </div>
        </div>
      )}
    </Drower1>
  );
}
