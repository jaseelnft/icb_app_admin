import { AddressT, EthereumBlockie } from "../../widgets/ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDate, formatICBX, parseEther } from "../../services/simple";
import { formatEther } from "ethers";

import {
  getValidator,
  getServerStat,
  getServerUsers,
  getServerInvests,
} from "../../services/validator";
import { MyLineGraph } from "../../components/graph";

export default function SingleValidator() {
  const { id } = useParams();

  const [busy, setbusy] = useState(true);
  const [server, setserver]: any = useState({});
  const [users, setusers]: any[] = useState([]);
  const [invests, setinvests]: any[] = useState([]);
  const [profits, setprofits]: any[] = useState([]);

  const [max, setmax] = useState(0);

  useEffect(() => {
    _loadData();
  }, []);

  const _loadData = async () => {
    setbusy(true);
    getValidator(id || "").then((res: any) => {
      setserver(res);
      setbusy(false);
    });
    getServerStat(id || "").then((res: any) => {
      setprofits(res);
      const _max = Math.max(...res.map((item: any) => Number(item.earned)));
      setmax(_max < 1e21 ? 1e21 : _max);
    });
    getServerUsers(id || "").then((res: any) => {
      setusers(res);
    });
    getServerInvests(id || "").then((res: any) => {
      setinvests(res);
    });
  };

  if (busy) return "Loading...";

  const _toICBX = (v: number) => {
    return formatICBX(
      Number(
        formatEther(
          BigInt(v.toLocaleString("fullwide", { useGrouping: false }))
        )
      )
    );
  };

  return (
    <div className="p-8 h-[calc(100vh-84px)] overflow-auto flex justify-center">
      <div className="max-w-[1040px] w-[100%]">
        <div className="flex justify-between">
          <div className="">
            <div className="text-[#4F8FE1]">{server?.name}</div>
            <AddressT
              address={server?.address ?? ""}
              className="text-white text-[20px]"
            />
          </div>
          {/* {isInvester && ( */}
          {/* <div className="flex gap-3">
            <InvestPop server={server} reload={_loadData} />
            <WithdrawPop server={server} reload={_loadData} />
          </div> */}
          {/* )} */}
        </div>
        {/* {!isInvester && (
          <div className="h-[calc(100vh-200px)] flex flex-col justify-center items-center">
            Your are not a investor on this server, join as a part of validator
            by investing now.
            <div className="flex gap-3 mt-4">
              <div className="btn1 flex">
                <img src={graphIc} className="w-[24px] mr-1" />
                Invest Now
              </div>
            </div>
          </div>
        )} */}
        {/* //////////////////////////////////////////////////////////////// */}
        {/* //////////////////////////////////////////////////////////////// */}
        {/* //////////////////////////////////////////////////////////////// */}
        <div className="border-2 border-[#ffffff0d] rounded-[24px] mt-8 bg-[#010513] py-10 px-8">
          <div className="text-2xl font-[600]">
            Profit Earned by {server.name} in last 6 monthes
          </div>
          <div className="flex mt-10">
            <div className="min-w-15 flex flex-col justify-between text-[#9E9E9E]">
              <div>{_toICBX(max)}</div>
              <div>{_toICBX(max / (4 / 3))}</div>
              <div>{_toICBX(max / 2)}</div>
              <div>{_toICBX(max / 4)}</div>
              <div>0</div>
              <div />
            </div>
            <div className="w-full">
              <div className="h-75 flex justify-between items-end relative px-[4%]">
                {profits.map((it: any, k: number) => (
                  <div
                    className="w-[50px] mx-[15px] bg-gradient-to-b from-[#021226] to-[#18365B] relative"
                    style={{ height: `${(Number(it.earned) / max) * 100}%` }}
                    key={k}
                  >
                    <div className="absolute top-[-40px] left-[-16px] right-[-16px] flex flex-col items-center">
                      <div className="bg-[#4F8FE1] text-xs font-[600] rounded-[6px] p-[6px_10px] rext-[#011022]">
                        {formatICBX(Number(formatEther(it?.earned ?? "0")))}
                      </div>
                      <div className="w-3 h-3 bg-[#4F8FE1] mt-[6px] rounded-full border-2" />
                    </div>
                  </div>
                ))}
                <div className="absolute top-0 bottom-0 left-10 right-10 px-[4%]">
                  <MyLineGraph
                    noShade
                    values={profits.map((it: any) => Number(it.earned) / max)}
                  />
                </div>
              </div>
              <div className="flex border-t w-[100%] justify-between py-6 px-[4%]">
                {profits.map((it: any, k: number) => (
                  <div className="w-[80px] text-center" key={k}>
                    {/* {formatYearMonth(it.period.split(":")[1])} */}
                    {it.period.split(":")[1]}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <div className="min-w-[256px] bg-[#011022] py-3 px-4 border-[1.5px] border-[#C7CCD21A] rounded-xl">
              <div>
                Total Invested
                <div className="font-[600]">
                  {Number(
                    formatEther(server?.invested ?? "0")
                  ).toLocaleString()}{" "}
                  ICBX{" "}
                  <span className="text-[#256DC9]">
                    ({((server?.invested / server?.capacity) * 100).toFixed(2)}
                    %)
                  </span>
                </div>
              </div>
            </div>
            <div className="min-w-[256px] bg-[#011022] py-3 px-4 border-[1.5px] border-[#C7CCD21A] rounded-xl">
              <div>
                Total Earned
                <div className="font-[600]">
                  {Number(formatEther(server?.earned ?? "0")).toLocaleString()}{" "}
                  ICBX
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-2 border-[#ffffff0d] rounded-[24px] mt-[32px] bg-[#010513]">
          <div className="font-[ClashDisplay] text-[22px] text-[#4F8FE1] rounded-[22px] p-6">
            Users
          </div>
          <div className="flex justify-between">
            <div className="min-w-16" />
            <div className="w-[32%] py-[20px] px-[24px]">User</div>
            <div className="w-[32%] py-[20px] px-[24px] text-right">Amount</div>
            <div className="w-[32%] py-[20px] px-[24px] text-right">Earned</div>
            <div className="w-[24%] py-[20px] px-[24px] text-center">
              Totel Invests
            </div>
          </div>
          {users.length === 0 && (
            <div className="p-4 text-center text-[14px]">
              {busy ? "Loading..." : "No user found in this server."}
            </div>
          )}
          {users.map((it: any, k: number) => (
            <div
              key={k}
              className="flex justify-between items-center text-[#A5A7AA] border-t border-[#111F31] py-3"
            >
              <div className="pl-8 min-w-18 flex justify-center">
                <EthereumBlockie address={it?.address} size={36} />
              </div>
              <div className="w-[32%] px-[24px]">
                <div>
                  <div>{it?.name || "null"}</div>
                  <AddressT
                    address={it?.address}
                    iconSize={20}
                    className="text-[#256DC9] text-sm"
                  />
                </div>
              </div>

              <div className="w-[32%] px-[24px] text-right">
                {formatICBX(Number(formatEther(it?.invested ?? "0")))}
                &nbsp; ICBX
              </div>
              <div className="w-[32%] px-[24px] text-right">
                {formatICBX(Number(formatEther(it?.earned ?? "0")))}
                &nbsp; ICBX
              </div>
              <div className="w-[24%] px-[24px] text-center">
                {it?.invests || 0}
              </div>
            </div>
          ))}
        </div>
        <div className="border-2 border-[#ffffff0d] rounded-[24px] mt-[32px] bg-[#010513]">
          <div className="font-[ClashDisplay] text-[22px] text-[#4F8FE1] rounded-[22px] p-6">
            Invests
          </div>
          <div className="flex justify-between">
            <div className="min-w-16" />
            <div className="w-[32%] py-[20px] px-[24px]">User</div>
            <div className="w-[32%] py-[20px] px-[24px] text-right">Amount</div>
            <div className="w-[32%] py-[20px] px-[24px] text-right">Earned</div>
            <div className="w-[32%] py-[20px] px-[24px]">Date & Time</div>
          </div>
          {invests.length === 0 && (
            <div className="p-4 text-center text-[14px]">
              {busy ? "Loading..." : "No invests found in this server."}
            </div>
          )}
          {invests.map((it: any, k: number) => (
            <div
              key={k}
              className="flex justify-between items-center text-[#A5A7AA] border-t border-[#111F31] py-3"
            >
              <div className="pl-8 min-w-18 flex justify-center">
                <EthereumBlockie address={it?.userId?.address} size={36} />
              </div>
              <div className="w-[32%] px-[24px]">
                <div>
                  <div>{it?.userId?.name || "null"}</div>

                  <AddressT
                    address={it?.userId?.address}
                    iconSize={20}
                    className="text-[#256DC9] text-sm"
                  />
                </div>
              </div>

              <div className="w-[32%] px-[24px] text-right">
                {formatICBX(Number(formatEther(it?.amount ?? "0")))}
                &nbsp; ICBX
              </div>
              <div className="w-[32%] px-[24px] text-right">
                {formatICBX(Number(formatEther(it?.earned ?? "0")))}
                &nbsp; ICBX
              </div>
              <div className="w-[32%] px-[24px]">
                {formatDate(it.createdAt)}
              </div>
            </div>
          ))}
        </div>
        <br /> <br />
      </div>
    </div>
  );
}
