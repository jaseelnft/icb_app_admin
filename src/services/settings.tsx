import { api } from "./config";

//
//

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

//
//

export async function getTwitterPosts(): Promise<any> {
  try {
    let res = await api.get("api/admin/settings/twitter-posts");
    return res.data;
  } catch (error) {}
}

export async function updateTwitterPosts(body_: any[]): Promise<any> {
  const body = body_.map(({ name, id }) => ({ name, id }));
  let res = await api.put("api/admin/settings/twitter-posts", body);
  return res.data;
}

//
//

export async function getBuyICBXstatus(): Promise<any> {
  try {
    let res = await api.get("api/admin/settings/buy-icbx");
    return res.data;
  } catch (error) {}
}

export async function updateBuyICBX(active: boolean): Promise<any> {
  let res = await api.put("api/admin/settings/buy-icbx", { active });
  return res.data;
}
