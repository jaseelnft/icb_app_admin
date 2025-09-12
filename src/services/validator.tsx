import { api } from "./axios";

interface ValidatorEditBody {
  name: string;
  address: string;
  capacity: string;
}

export async function getValidators(): Promise<any> {
  const res = await api.get("api/admin/validators");
  return res.data;
}

export async function createValidator(body: ValidatorEditBody): Promise<any> {
  const res = await api.post("api/admin/validators", body);
  return res.data;
}

export async function updateValidator(
  _id: string,
  body: ValidatorEditBody
): Promise<any> {
  const res = await api.put("api/admin/validators/" + _id, body);
  return res.data;
}
