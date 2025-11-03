import { ethers } from "ethers";

export const inputToICBX = (value: string): string => {
  return value
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*)\./g, "$1")
    .replace(/^(\d*\.\d{0,2}).*$/, "$1");
};

export const formatICBX = (num: number) => {
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

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export function formatYearMonth(input: string) {
  const [year, month] = input.split("-").map(Number);
  const date = new Date(year, month);
  const monthName = date.toLocaleString("en-US", { month: "short" });
  return `${year} ${monthName}`;
}

export const formatEther = (value: string): number => {
  return Number(ethers.formatEther(value));
};

export const parseEther = (value: string): string => {
  return String(ethers.parseEther(value));
};

export const isValidHash = (hash: string) => {
  return /^0x([A-Fa-f0-9]{64})$/.test(hash);
};
