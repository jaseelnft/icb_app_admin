import { api } from "./axios";

export async function getDetails(): Promise<any> {
  const res = await api.get("api/admin/details");
  return res.data;
}

export async function getStatistics(): Promise<any> {
  const res = await api.get("api/admin/statistics");
  return res.data;
}

export async function getUsers(page_: number): Promise<any> {
  const res = await api.get("api/admin/users?page=" + page_);
  const total = Number(res.headers["x-total"]);
  const page = Number(res.headers["x-page"]);
  return { total, page, data: res.data };
}

export async function getWithdrawal(): Promise<any> {
  const res = await api.get("api/admin/withdrawal");
  return res.data;
}
