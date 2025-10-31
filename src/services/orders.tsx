import { api } from "./config";

export async function getUserOrders(p: number, s: string): Promise<any> {
  try {
    const res = await api.get(`api/admin/sales/orders?page=${p}&search=${s}`);
    return res.data;
  } catch (error) {}
}

export async function getSalesHistory(p: number, s: string): Promise<any> {
  try {
    const res = await api.get(`api/admin/sales?page=${p}&search=${s}`);
    return res.data;
  } catch (error) {}
}

export async function aproveOrder(
  id: string,
  hash: string,
  note: string
): Promise<any> {
  const url = `api/admin/sales/${id}/accept`;
  const res = await api.patch(url, { hash, note });
  return res.data;
}

export async function rejectOrder(id: string, note: string): Promise<any> {
  const url = `api/admin/sales/${id}/reject`;
  const res = await api.patch(url, { note });
  return res.data;
}
