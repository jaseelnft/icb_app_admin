import { api } from "./axios";

export async function getDetails(): Promise<any> {
  const res = await api.get("api/admin/details");
  return res.data;
}

export async function getStatistics(): Promise<any> {
  const res = await api.get("api/admin/statistics");
  return res.data;
}

export async function getUsers(p: number, s: string): Promise<any> {
  const res = await api.get(`api/admin/users?page=${p}&search=${s}`);
  const total = Number(res.headers["x-total"]);
  const page = Number(res.headers["x-page"]);
  return { total, page, data: res.data };
}

export async function getWithdrawal(
  page_: number,
  status: string
): Promise<any> {
  const res = await api.get(
    `api/admin/withdrawal?page=${page_}&status=${status}`
  );
  const total = Number(res.headers["x-total"]);
  const page = Number(res.headers["x-page"]);
  return { total, page, data: res.data };
}

export async function aproveWithdraw(
  id: string,
  hash: string,
  note: string
): Promise<any> {
  const res = await api.patch(`api/admin/withdrawal/${id}/accept`, {
    hash,
    note,
  });
  return res.data;
}

export async function rejectWithdraw(id: string, note: string): Promise<any> {
  const res = await api.patch(`api/admin/withdrawal/${id}/reject`, {
    note,
  });
  return res.data;
}

export async function updateRewardBalance(): Promise<any> {
  const res = await api.get("api/admin/rewards/update-history");
  return res.data;
}

export async function getTxns(_p: number, _s: string): Promise<any> {
  const res = await api.get(`api/admin/txns?page=${_p}&search=${_s}`);
  const total = Number(res.headers["x-total"]);
  const page = Number(res.headers["x-page"]);
  return { total, page, data: res.data };
}
