import { setDashboard, setUsers, store } from "../redux/store";
import { api } from "./config";
import { bigToString, gatEthBalance, haveKYCNFT } from "./ethers";
import { showToast, showWarningToast } from "./toast";

// START - Basic Details
export async function getDetails(): Promise<any> {
  const res = await api.get("api/admin/details");
  return res.data;
}

export async function getStatistics(): Promise<any> {
  try {
    const res = await api.get("api/admin/statistics");
    store.dispatch(setDashboard(res.data));
  } catch (e) {}
}
// END - Basic Details

// START - Users
export async function getUsers(p: number, s: string): Promise<any> {
  try {
    const res = await api.get(`api/admin/users?page=${p}&search=${s}`);

    const runs = [];
    for (let it of res.data.data) {
      runs.push(
        gatEthBalance(it.address).then((res) => (it.icbx = bigToString(res)))
      );
      runs.push(haveKYCNFT(it.address).then((res) => (it.haveKYC = res)));
    }

    await Promise.all(runs);
    res.data.data.map((it: any) => (it.done = true));

    store.dispatch(setUsers({ ...res.data, busy: false }));
  } catch (e) {
    console.log(e);
  }
}
// END - Users

// START - Withdrawal fund
export async function getWithdrawal(p: number, s: string): Promise<any> {
  const url = `api/admin/withdrawal?page=${p}&status=${s}`;
  const res = await api.get(url);
  return res.data;
}

export async function aproveWithdraw(
  id: string,
  hash: string,
  note: string
): Promise<any> {
  const url = `api/admin/withdrawal/${id}/accept`;
  const res = await api.patch(url, { hash, note });
  return res.data;
}

export async function rejectWithdraw(id: string, note: string): Promise<any> {
  const url = `api/admin/withdrawal/${id}/reject`;
  const res = await api.patch(url, { note });
  return res.data;
}

export async function getRewardUsers(p: number, s: string): Promise<any> {
  const res = await api.get(`api/admin/rewards?page=${p}&search=${s}`);
  return res.data;
}

export async function updateRewardBalance(): Promise<any> {
  const res = await api.get("api/admin/rewards/update-history");
  return res.data;
}

export async function getTxns(
  p: number,
  f: string,
  s: string,
  t: string
): Promise<any> {
  const res = await api.get(
    `api/admin/txns?page=${p}&search=${f}&status=${s}&type=${t}`
  );
  return res.data;
}
// END - Withdrawal fund

// START - Random Wallets
export async function getRandomWallets(p: number, s: string): Promise<any> {
  const url = `api/admin/txns/random-wallets?page=${p}&status=${s}`;
  const res = await api.get(url);
  return res.data;
}

export async function updareRandomWallets(): Promise<any> {
  try {
    const res = await api.patch("api/admin/txns/random-wallets");
    const l = res.data.length;
    if (l === 0) showWarningToast(`No Wallets updated`);
    else showToast(`Succefully updated ${l} wallets`);
  } catch (error) {}
}

export async function exportValidRandomWallet(): Promise<any> {
  try {
    const res = await api.get("api/admin/txns/export-valid-random-wallet", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ValidRandomWallets.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    showToast("✅ Successfully downloaded");
  } catch (error) {}
}

// END - Random Wallets
