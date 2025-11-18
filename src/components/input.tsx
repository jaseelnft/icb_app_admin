import { useState } from "react";
import { IC } from "./librery";

export function AppSearch(props: { onChange: Function; hint?: string }) {
  const [value, setvalue] = useState("");
  const { onChange, hint } = props;

  return (
    <div className="flex border border-[#16263B] rounded-lg p-2 w-80 bg-[#0F1626] h-10">
      <img alt="Filter" src={IC.lens} className="opacity-50 mr-1 w-5" />
      <input
        placeholder={hint || "Search..."}
        className="w-full border-none outline-none"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setvalue(e.target.value);
        }}
      />
      {value !== "" && (
        <img
          alt="Filter"
          src={IC.close}
          className="ml-2 w-5 cursor-pointer"
          onClick={() => {
            setvalue("");
            onChange("");
          }}
        />
      )}
    </div>
  );
}

export function AppFilter(props: {
  onChange: Function;
  list: { name: string; value: string }[];
}) {
  const { onChange, list } = props;

  return (
    <div className="flex border border-[#16263B] rounded-lg p-2 bg-[#0F1626] h-10">
      <img alt="Filter" src={IC.filter} className="opacity-50 mr-1 w-5" />
      <select
        id="search"
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-none outline-none"
      >
        {list.map((it) => (
          <option value={it.value} key={it.value}>
            {it.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// export function AppFilter({ children }: any) {
//   const [on, seton] = useState(false);
//   return (
//     <div className="relative">
//       <img
//         alt="Filter"
//         src={IC.filter}
//         className="cursor-pointer border border-[#16263B] rounded-lg p-2 bg-[#0F1626] h-10 opacity-80"
//         onClick={() => seton(!on)}
//       />
//       {on && (
//         <div className="absolute top-11 border border-[#16263B] rounded-lg p-3 bg-[#0F1626] text-xs">
//           {children}
//           <div className="flex justify-end gap-2 mt-3">
//             <div className="ShadedBtn Black rounded-full py-1 px-4 font-[600]" >Export</div>
//             <div className="ShadedBtn rounded-full py-1 px-4 font-[600]" >Applay</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
