import { api } from "./config";
import { showToast } from "./toast";

export async function getStakings(
  p: number,
  f: string,
  s: string
): Promise<any> {
  const res = await api.get(
    `api/admin/stakes?page=${p}&search=${f}&status=${s}`
  );
  return res.data;
}

export async function exportStakes(): Promise<any> {
  try {
    const res = await api.get("api/admin/stakes/export", {
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Stakes.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

    showToast("✅ Successfully downloaded");
  } catch (error) {}
}
