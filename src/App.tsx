import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/home";
import AuthLayout from "./layouts/auth";
import DashboardPage from "./pages";
import UsersPage from "./pages/users";
import ValidatorsPage from "./pages/validators";
import LoginPage from "./pages/auth/login";
import OTPPage from "./pages/auth/otp";
import WithdrawalPage from "./pages/withdrawel";
import RewardLogsPage from "./pages/reward-logs";
import TransactionsPage from "./pages/transactions";
import AppSettingsPage from "./pages/app-settings";
import LoadingPage from "./components/loadingPage";
import { useEffect, useState } from "react";
import { setBasicConfig } from "./services/axios";
import SupportPage from "./pages/support";

function App() {
  const [busy, setbusy] = useState(true);

  useEffect(() => {
    setBasicConfig().then(() => {
      setbusy(false);
    });
  }, []);

  if (busy) return <LoadingPage />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="validator" element={<ValidatorsPage />} />
          <Route path="withdraw-requests" element={<WithdrawalPage />} />
          <Route path="reward-logs" element={<RewardLogsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="app-settings" element={<AppSettingsPage />} />
          <Route path="*" element={<DashboardPage />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="otp" element={<OTPPage />} />
          <Route path="*" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
