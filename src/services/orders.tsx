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
