// import { useEffect, useState } from "react";
// import { getUsers } from "../services/dashboard";
// import { AddressT, EthereumBlockie } from "../widgets/ethers";
// import { IC } from "../components/librery";
// import { gatEthBalance, haveKYCNFT, weiToICBX } from "../services/ethers";
// import { Paging } from "../components/paging";
// import { useSelector } from "react-redux";
// import { setUsers, store } from "../redux/store";

// export default function UsersPage() {
//   const [busy, setbusy] = useState(false);
//   // const [datas, setdatas]: any = useState([]);
//   // const [page, setpage] = useState(1);
//   // const [total, settotal] = useState(0);
//   const [search, setsearch] = useState("");

//   const { total, page, data } = useSelector((state: any) => state.data.users);

//   useEffect(() => {
//     _loadDatas(1, "");
//   }, []);

//   const _loadDatas = async (page_: number, search_: string) => {
//     if (busy) return;
//     setbusy(true);
//     await getUsers(page_, search_)
//       .then(async (res) => {
//         // setdatas(res.data);
//         // setpage(res.page);
//         // settotal(res.total);
//         // for (let it of res.data)  _setEthANDKYC(res.data, it.address);

//         for (let it of data) _setEthANDKYC(it.address);
//         // setbusy(false);
//       })
//       .catch(() => {})
//       .finally(() => setbusy(false));
//   };

//   // const _setEthANDKYC = async (list: any, ad: string) => {
//   const _setEthANDKYC = async (ad: string) => {
//     const icbx = await gatEthBalance(ad);
//     const haveKYC = await haveKYCNFT(ad);
//     const tg = data.find((it: any) => it.address === ad);
//     if (tg) {
//       tg.icbx = icbx;
//       tg.haveKYC = haveKYC;
//       tg.done = true;
//       store.dispatch(setUsers({ total, page, data }));
//       // setdatas([...list]);
//     }
//   };

//   const _search = (e: any) => {
//     const value = e.target.value;
//     setsearch(value);
//     if (value.length > 2) _loadDatas(1, value);
//     else if (value.length === 0) _loadDatas(1, "");
//   };

//   const elSt =
//     "px-5 py-3 flex items-center border-r border-[#16263B] last:border-0 overflow-hidden ";

//   return (
//     <div className="p-8">
//       <div className="flex justify-between">
//         <div className="text-xl">
//           <span className="text-[#4F8FE1] font-bold ">Platform Users</span> (
//           {total})
//         </div>
//       </div>
//       <div className="bg-[#010513] border-1 border-[#010513] mt-6 rounded-[16px] overflow-hidden">
//         <div className="bg-[#011022] rounded-t-[16px] p-5 flex gap-3 items-center border-b border-[#16263B] text-sm">
//           <input
//             placeholder="Search by User, Email, or Wallet Address"
//             className="border border-[#16263B] rounded-lg py-2 px-4 w-92 bg-[#0F1626]"
//             style={{ backgroundImage: `url('${IC.lens}')` }}
//             onChange={_search}
//           />
//           {/* <select
//             className="border border-[#16263B] rounded-lg py-2 px-4 w-50 bg-[#0E1C2F]"
//             id="search"
//           >
//             <option>All Status</option>
//           </select> */}
//         </div>
//         <div className="flex text-[14px] px-2">
//           <div className="min-w-16" />
//           <div className={elSt + "py-5 w-[40%]"}>User</div>
//           <div className={elSt + "py-5 w-[34%]"}>Wallet Address</div>
//           <div className={elSt + "py-5 w-[26%] justify-end"}>PICBX Balance</div>
//           <div className={elSt + "py-5 w-[26%] justify-end"}>ICBX Balance</div>
//           <div className={elSt + "py-5 w-[20%]"}>Action</div>
//         </div>
//         {busy && <div className="text-center text-sm p-4">Loading...</div>}
//         {total < 1 && <div className="text-center text-sm p-4">No Data</div>}
//         {data.map((_it: any, k: number) => (
//           <div className="flex odd:bg-[#0a101d] px-2" key={k}>
//             <div className="py-4 pl-4 min-w-16 flex justify-center">
//               <EthereumBlockie address={_it.address} size={36} />
//             </div>
//             <div className={elSt + "w-[40%]"}>
//               <div>
//                 <div>{_it.name || "null"}</div>
//                 <div className="text-[#256DC9] text-sm">
//                   {_it.email || "null"}
//                 </div>
//               </div>
//             </div>

//             <AddressT
//               address={_it.address}
//               iconSize={20}
//               className={elSt + "w-[34%] text-[#B3BDCB] text-sm"}
//             />

//             <div
//               className={
//                 elSt + "w-[26%] text-[#A5A7AA] text-sm text-right justify-end"
//               }
//             >
//               {weiToICBX(_it.totalBalance ?? "0")} ICBX
//             </div>
//             {_it.done ? (
//               <div className={elSt + "w-[26%] text-sm items-end flex-col"}>
//                 {weiToICBX(_it.icbx ?? "0")} ICBX
//                 {_it.haveKYC ? (
//                   <div className="flex gap-2 items-center text-[green]">
//                     <div className="w-2 h-2 rounded-[4px] bg-[green]" />
//                     KYC Verifide
//                   </div>
//                 ) : (
//                   <div className="flex gap-2 items-center text-[red]">
//                     <div className="w-2 h-2 rounded-[4px] bg-[red]" />
//                     KYC Not Verifide
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className={elSt + "w-[26%] text-sm justify-end"}>
//                 Loading..
//               </div>
//             )}

//             <div className={elSt + "w-[20%]"}>
//               <div className="bg-[#4F8FE11A] border border-[#4F8FE14D] w-8 h-8 rounded cursor-pointer flex">
//                 <img src={IC.eye} className="min-w-2 min-h-2 p-[5px]" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//       <Paging
//         total={total}
//         page={page}
//         reload={(a1: any) => _loadDatas(a1, search)}
//       />
//     </div>
//   );
// }
