import { Address, Hex } from "viem";

export type ChaintoolType = {
  idx: bigint;
  name: string;
  desc: string;
  abitypes: string[];
  categories: Hex[];
  target: Address;
  owner: Address;
};

export const CONTRACT_ADDRESS = "0x5d29f6180A7a3D02623c1F74e4244C53beAA1c53";
