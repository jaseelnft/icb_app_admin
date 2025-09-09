import { api } from "./axios";

export async function getDetails(): Promise<any> {
  let res = await api.get("api/admin/details");
  return res.data;
}

export async function getUsers(): Promise<any> {
  let res = await api.get("api/admin/users");
  return res.data;
}

export async function getWithdrawal(): Promise<any> {
  let res = await api.get("api/admin/withdrawal");
  return res.data;
}
