import { IC } from "../components/librery";

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

export function Drower1({
  on,
  close,
  title,
  children,
}: {
  on: boolean;
  close: Function;
  title: any;
  children: any;
}) {
  if (!on) return;  
  return (
    <div
      className={
        "fixed top-0 left-0 bottom-0 flex justify-end p-2 transition duration-300 bg-[#FFFFFF22] " +
        (on ? "right-0" : "right-110")
      }
      onClick={() => close()}
    >
      <div
        className="bg-[#011022] h-full rounded-[12px] border border-[#16263B] min-w-110 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-18 border-b border-[#16263B] px-4 flex justify-between items-center bg-[#010513]">
          <div className="font-bold">{title}</div>
          <img
            src={IC.close}
            className="w-6 cursor-pointer"
            onClick={() => close()}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
