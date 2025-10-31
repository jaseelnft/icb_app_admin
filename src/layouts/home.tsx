import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IC, Logo } from "../components/librery";
import { Popup1 } from "./popup";
import { APP_VERSION, appLogOut, connectWs } from "../services/config";
import { getDetails } from "../services/dashboard";
import LoadingPage from "../components/loadingPage";

export default function HomeLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [busy, setbusy] = useState(true);
  const [main, setmain] = useState("MAIN");

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
      <>
        <div
          key={v}
          className="text-[11px] text-[#C7CCD2] px-3 py-3 font-[600] cursor-pointer flex justify-between"
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
      </>
    );
  };

  if (busy) return <LoadingPage />;
  return (
    <div className="flex w-full h-[100vh]">
      <div className="min-w-[260px] bg-[#011022] p-6 border-r border-[#FFFFFF1A] flex flex-col justify-between items-center hidden lg:flex">
        <div className="w-full">
          <img src={Logo.appFull} className="h-15" />
          <div className="bg-gradient-to-r from-[#101B2D] to-[#182842]" />
          <div className="h-[2px] w-full bg-gradient-to-r from-[#011022] via-[#3D6FAE] to-[#011022] mt-5 mb-8"></div>
          {mainSet("MAIN", [
            eachSide("Dashboard", "", IC.dashboard, IC.dashboard_),
            eachSide("Users", "users", IC.users, IC.users_),
            eachSide("Validator", "validator", IC.validator, IC.validator_),
            eachSide("Reward Logs", "reward-logs", IC.trophy, IC.trophy_),
            eachSide("Support", "support", IC.support, IC.support_),
          ])}
          {mainSet("WICBX", [
            eachSide(
              "Withdraw Request",
              "withdraw-requests",
              IC.withdraw,
              IC.withdraw_
            ),
            eachSide("Random Wallets", "random-wallets", IC.payments, IC.payments_),
            eachSide("Transactions", "transactions", IC.card, IC.card_),
          ])}
          {mainSet("SALES", [
            eachSide("Orders", "orders", IC.sell, IC.sell_),
            eachSide("Payments", "payments", IC.payments, IC.payments_),
          ])}
          {mainSet("SETTINGS", [
            eachSide("App Settings", "app-settings", IC.gear, IC.gear_),
            eachSide("Admins", "admins", IC.users, IC.users_),
          ])}
        </div>
        <div className="w-[80%]">
          <Logout />
          <br />
          <div className="text-center text-[13px]">
            Developed by ICB Lab, v{APP_VERSION}
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="h-22 bg-[#010513] flex justify-between items-center">
          <div className="font-[ClashDisplay] px-6 text-[18px]">
            {pathname === `/` && "Dashboard"}
            {pathname === `/users` && "Users"}
            {pathname === `/validator` && "Validators"}
            {pathname === `/withdraw-requests` && "Withdraw Requests"}
            {pathname === `/reward-logs` && "Reward Logs"}
            {pathname === `/random-wallets` && "Random Wallets"}
            {pathname === `/transactions` && "Transactions"}
            {pathname === `/support` && "Support"}
            {pathname === `/orders` && "Orders"}
            {pathname === `/payments` && "Payments"}
            {pathname === `/app-settings` && "App Settings"}
            {pathname === `/admins` && "Admins"}
          </div>
        </div>
        <div className="h-[calc(100vh-88px)] overflow-auto bg-gradient-to-b from-[#101B2D] via-[#142442] to-[#101B2D]">
          <Outlet />
        </div>
      </div>
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
