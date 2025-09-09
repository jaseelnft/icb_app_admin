import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/home";
import AuthLayout from "./layouts/auth";
import DashboardPage from "./pages";
import UsersPage from "./pages/users";
import ValidatorsPage from "./pages/validators";
import LoginPage from "./pages/auth/login";
import OTPPage from "./pages/auth/otp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route path="" element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="validators" element={<ValidatorsPage />} />
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
