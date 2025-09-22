export function Paging({ total, page, reload }: any) {
  if (total < 11) return;

  const end = Math.ceil(total / 10);
  const list = Array.from({ length: end }, (_, i) => i + 1);

  const _isVisible = (v: number) => {
    if (v === 1) return true;
    if (v === end) return true;
    if (v === page) return true;
    if (v === page - 1) return true;
    if (v === page - 2) return true;
    if (v === page - 3 && page > end - 3) return true;
    if (v === page + 1) return true;
    if (v === page + 2) return true;
    if (v === page + 3 && page < 3) return true;
    return false;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="flex border border-[#16263B] rounded-[8px]">
        <div
          className="cursor-pointer py-2 px-4 border-r-1 border-[#16263B]"
          onClick={() => (page > 1 ? reload(page - 1) : null)}
        >
          Previous
        </div>
        {list.map((it, k) =>
          _isVisible(it) ? (
            <div
              onClick={() => reload(it)}
              className={
                "cursor-pointer p-2 min-w-9 border-r-1 border-[#16263B] text-center" +
                (page === it ? " bg-[#256DC9] text-white" : "")
              }
              key={k}
            >
              {it}
            </div>
          ) : (
            _isVisible(list[k - 1]) && (
              <div
                className={
                  "p-2 min-w-9 border-r-1 border-[#16263B] text-center"
                }
                key={k}
              >
                ...
              </div>
            )
          )
        )}

        <div
          className="cursor-pointer py-2 px-4"
          onClick={() => (page < end ? reload(page + 1) : null)}
        >
          Next
        </div>
      </div>
    </div>
  );
}
