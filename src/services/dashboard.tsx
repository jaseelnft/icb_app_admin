import { setDashboard, setUsers, store } from "../redux/store";
import { api } from "./axios";
import { bigToString, gatEthBalance, haveKYCNFT } from "./ethers";

export async function getDetails(): Promise<any> {
  const res = await api.get("api/admin/details");
  return res.data;
}

export async function getStatistics(): Promise<any> {
  try {
    const res = await api.get("api/admin/statistics");
    store.dispatch(setDashboard(res.data));
    return res.data;
  } catch (error) {
    return;
  }
}

export async function getUsers(p: number, s: string): Promise<any> {
  try {
    const res = await api.get(`api/admin/users?page=${p}&search=${s}`);
    const total = Number(res.headers["x-total"]);
    const page = Number(res.headers["x-page"]);

    const runs = [];

    for (let i = 0; i < res.data.length; i++) {
      const it = res.data[i];
      runs.push(
        gatEthBalance(it.address).then((res) => (it.icbx = bigToString(res)))
      );
      runs.push(haveKYCNFT(it.address).then((res) => (it.haveKYC = res)));
    }

    await Promise.all(runs);

    res.data.map((it: any) => (it.done = true));

    store.dispatch(setUsers({ total, page, data: res.data, busy: false }));
  } catch (error) {
    console.log("Poottti");
  }
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

export async function getRewardUsers(p: number, s: string): Promise<any> {
  const res = await api.get(`api/admin/rewards?page=${p}&search=${s}`);
  const total = Number(res.headers["x-total"]);
  const page = Number(res.headers["x-page"]);
  return { total, page, data: res.data };
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
