import { useEffect, useState } from "react";
import { IC, Logo } from "../components/librery";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Popup1 } from "./popup";
import { APP_VERSION } from "../services/axios";
import { getDetails } from "../services/dashboard";
import LoadingPage from "../components/loadingPage";

export default function HomeLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [busy, setbusy] = useState(true);

  useEffect(() => {
    getDetails()
      .then(() => {})
      .catch(() => {})
      .finally(() => setbusy(false));
  }, []);

  const _eachSide = (title: string, value: string, i1: string, i2: string) => {
    return (
      <div
        className={`mt-3 px-4 h-12 text-[14px] text-[#A5A7AA] flex items-center cursor-pointer relative w-full ${
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

  if (busy) return <LoadingPage />;

  return (
    <div className="flex w-full h-[100vh]">
      <div className="min-w-[260px] bg-[#011022] p-6 border-r border-[#FFFFFF1A] flex flex-col justify-between items-center">
        <div className="w-full">
          <img src={Logo.appFull} className="h-15" />
          <div className="bg-gradient-to-r from-[#101B2D] to-[#182842]" />
          <div className="h-[2px] w-full bg-gradient-to-r from-[#011022] via-[#3D6FAE] to-[#011022] mt-5 mb-8"></div>
          <div className="text-[11px] text-[#C7CCD2] px-3 font-[600]">MAIN</div>
          {_eachSide("Dashboard", "", IC.dashboard, IC.dashboard_)}
          {_eachSide("Users", "users", IC.users, IC.users_)}
          {_eachSide("Validator", "validator", IC.validator, IC.validator_)}
          {_eachSide(
            "Withdraw Request",
            "withdraw-requests",
            IC.withdraw,
            IC.withdraw_
          )}
          {_eachSide("Reward Logs", "reward-logs", IC.trophy, IC.trophy_)}
          {_eachSide("Transactions", "transactions", IC.card, IC.card_)}
          <div className="bg-[#16263B] h-[2px] my-6" />
          <div className="text-[11px] text-[#C7CCD2] px-3 font-[600]">
            SETTINGS
          </div>
          {_eachSide("App Settings", "app-settings", IC.gear, IC.gear_)}
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
            {pathname === `/transactions` && "Transactions"}
            {pathname === `/app-settings` && "App Settings"}
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
              className="btn2 w-[190px]"
              onClick={() => setselected(false)}
            >
              Cancel
            </button>
            <button
              className="btn1 w-[190px]"
              onClick={() => {
                navigate("/auth/login");
                localStorage.setItem("authToken", "");
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
