import { api } from "./config";
import { parseEther } from "./simple";

interface ValidatorEditBody {
  name: string;
  address: string;
  capacity: string;
  earned: string;
  transferred: string;
}

export async function getValidators(): Promise<any> {
  const res = await api.get("api/admin/validators");
  return res.data;
}

export async function getValidator(id: string): Promise<any> {
  const res = await api.get("api/admin/validators/" + id);
  return res.data;
}

export async function getServerStat(id: string): Promise<any> {
  const url = `api/admin/validators/${id}/stat`;
  const res = await api.get(url);
  return res.data;
}

export async function getServerUsers(id: string): Promise<any> {
  const url = `api/admin/validators/${id}/users`;
  const res = await api.get(url);
  return res.data;
}

export async function getServerInvests(id: string): Promise<any> {
  const url = `api/admin/validators/${id}/invests`;
  const res = await api.get(url);
  return res.data;
}

export async function createValidator(_body: ValidatorEditBody): Promise<any> {
  const body = {
    ..._body,
    capacity: parseEther(_body.capacity),
    earned: parseEther(_body.earned),
    transferred: parseEther(_body.transferred),
  };
  const res = await api.post("api/admin/validators", body);
  return res.data;
}

export async function updateValidator(
  _id: string,
  _body: ValidatorEditBody
): Promise<any> {
  const body = {
    ..._body,
    capacity: parseEther(_body.capacity),
    earned: parseEther(_body.earned),
    transferred: parseEther(_body.transferred),
  };
  const res = await api.put("api/admin/validators/" + _id, body);
  return res.data;
}
