import { Outlet, useNavigate } from "react-router-dom";
import { BG } from "../components/librery";
import { useEffect } from "react";

export default function AuthLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken") || "";
    if (token && token !== "") navigate("/");
  }, []);

  return (
    <div className="h-[100vh] w-full flex items-center justify-center relative">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={BG.login}
      />
      <div className="border-2 border-[#4F8FE14D] bg-[#010513] rounded-[24px] p-8 lg:p-15 relative overflow-hidden max-w-[480px] w-full m-4">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
          src={BG.login2}
        />
        <div className="relative">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
