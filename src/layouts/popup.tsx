export function Popup1({ selected, close, children, className }: any) {
  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center backdrop-blur-sm bg-white/10 ${
        selected ? "flex" : "hidden"
      }`}
      onClick={close}
    >
      <div
        className={"rounded-[20px] bg-[#010513] m-2 " + className}
        onClick={(e: any) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
