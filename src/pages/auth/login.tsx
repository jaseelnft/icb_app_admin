import { Logo } from "../../components/librery";
import { useNavigate } from "react-router-dom";
import { verifyAdmin } from "../../services/auth";
import { useState } from "react";

export default function LoginPage() {
  const [busy, setbusy] = useState(false);
  const navigate = useNavigate();

  const _onSubmit = async (e: any) => {
    e.preventDefault();
    if (busy) return;
    setbusy(true);
    await verifyAdmin({ email: e.target.email.value })
      .then((res) => {
        localStorage.setItem("authToken", res.token);
        navigate("/auth/otp");
      })
      .catch(() => {})
      .finally(() => setbusy(false));
  };

  return (
    <form onSubmit={_onSubmit}>
      <img src={Logo.app} className="w-[90px]" />
      <div className="text-[28px] font-[ClashDisplay] mt-4">
        LOGIN TO ICB NETWORK
      </div>
      <div className="mt-8">Username or Email</div>
      <input
        className="text-[14px] mt-2 border-[1.5px] border-[#16263B] bg-[#0F1626] rounded-[12px] px-4 py-3 w-full"
        placeholder="Enter your username"
        required
        autoFocus
        type="email"
        id="email"
      />
      <button
        className={
          "ShadedBtn flex justify-center items-center rounded-full h-13 font-[600] w-full mt-16" +
          (busy ? " BusyBtn" : "")
        }
      >
        Send OTP
      </button>
    </form>
  );
}
