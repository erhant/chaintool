import type { Address } from "viem";

export type Chaintool = {
  description: string;
  idx: bigint;
  category: string;
  name?: string;
  target?: Address;
  owner?: Address;
};

export type ChaintoolDetailed = {
  idx: bigint;
  name: string;
  desc: string;
  abitypes: readonly string[];
  categories: readonly `0x${string}`[];
  target: `0x${string}`;
  owner: `0x${string}`;
};

export const CONTRACT_ADDRESS = "0x9eD9db9C2fBD5B913635919BFb4784BcB941b7Fa";
