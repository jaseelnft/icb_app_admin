import { api } from "./config";

export async function getVerifideToken(): Promise<any> {
  try {
    let res = await api.get("api/admin/settings/verified-tokens");
    return res.data;
  } catch (error) {}
}

export async function updateVerifideToken(body_: any[]): Promise<any> {
  const body = body_.map(({ name, address }) => ({ name, address }));
  let res = await api.put("api/admin/settings/verified-tokens", body);
  return res.data;
}
