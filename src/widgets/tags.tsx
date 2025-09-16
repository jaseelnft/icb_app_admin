export function StatusTags({ status }: { status: string }) {
  let s1 =
    "bg-[#00B6761A] px-2 py-1 rounded-[4px] text-xs text-[#00B676] font-[600] flex items-center gap-1";
  let s2 = "w-2 h-2 bg-[#00B676] rounded-[4px] mt-[1px]";
  if (status === "succes") {
    status = "Aproved";
  } else if (status === "rejected") {
    status = "Rejected";
    s1 =
      "bg-[#DF3A451A] px-2 py-1 rounded-[4px] text-xs text-[#DF3A45] font-[600] flex items-center gap-1";
    s2 = "w-2 h-2 bg-[#DF3A45] rounded-[4px] mt-[1px]";
  } else if (status === "pending") {
    status = "Pending";
    s1 =
      "bg-[#F17F1B1A] px-2 py-1 rounded-[4px] text-xs text-[#F1941B] font-[600] flex items-center gap-1";
    s2 = "w-2 h-2 bg-[#F1941B] rounded-[4px] mt-[1px]";
  }
  return (
    <div className={s1}>
      <div className={s2} />
      {status}
    </div>
  );
}
