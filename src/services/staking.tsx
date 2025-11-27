import { api } from "./config";

export async function getStakings(
  p: number,
  f: string,
  s: string
): Promise<any> {
  const res = await api.get(`api/admin/stakes?page=${p}&search=${f}&status=${s}`);
  return res.data;
}
