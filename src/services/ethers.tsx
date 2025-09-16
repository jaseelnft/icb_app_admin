import { icbKycNFTContract, provider } from "./axios";
import { ethers } from "ethers";

export const weiToEth = (value: string): number => {
  return Number(ethers.formatEther(value));
};

export const ethToWei = (value: string): string => {
  return String(ethers.parseEther(value));
};

export const weiToICBX = (num_: string) => {
  const num = weiToEth(num_);
  if (num === undefined || num === null) return "0";
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 10_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return num.toLocaleString(); // e.g., 9,999
  }
};

export async function haveKYCNFT(address: string) {
  let haveICBKYC = null;
  try {
    const tokenId = await icbKycNFTContract.addressToTokenId(address);
    const isBlacklisted = await icbKycNFTContract.blackList(address);
    if (tokenId > 0 && !isBlacklisted) haveICBKYC = true;
  } catch (e) {}
  if (!haveICBKYC) haveICBKYC = false;

  return haveICBKYC;
}

export const gatEthBalance = async (address: string) => {
  return provider.getBalance(address).then((res) => res);
};
