import { api } from "./axios";

interface VerifyDto {
  email: string;
}

interface VerifyResDto {
  token: string;
}

interface LoginDto {
  otp: string;
  token: string;
}

interface LoginResDto {
  token: string;
}

export async function verifyAdmin(body: VerifyDto): Promise<VerifyResDto> {
  let res = await api.post("api/auth/admin/verify", body);
  return res.data;
}

export async function loginAdmin(body: LoginDto): Promise<LoginResDto> {
  let res = await api.post("api/auth/admin/login", body);
  return res.data;
}
