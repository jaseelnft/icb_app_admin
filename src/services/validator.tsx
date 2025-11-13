import { api } from "./config";
import { parseEther } from "./simple";
import { showToast } from "./toast";

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

export async function exportValidatorInvests(): Promise<any> {
  try {
    const res = await api.get("api/admin/validators/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ValidatorInvests.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    showToast("✅ Successfully downloaded");
  } catch (error) {}
}
