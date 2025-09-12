
import { APP_VERSION } from "../services/axios";
import { Logo } from "./librery";

export default function LoadingPage() {
  return (
    <div className="flex flex-col justify-center items-center w-[100%] h-[100vh]">
      <img src={Logo.appFull} width={160} />
      <div className="text-[14px] mt-6">Loading (v{APP_VERSION})</div>
      
    </div>
  );
}
