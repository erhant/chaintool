import { describe, expect, test } from "bun:test";
import { encodeAbiParameters, encodeFunctionData, parseAbi, parseAbiParameters } from "viem";

describe("abi encoding tests", () => {
  test("addition", () => {
    // this will be read from the contract
    const ABI: string = "function add(int256 a, int256 b) pure returns (int256)";
    const parsedAbi = parseAbi([ABI]);
    const calldata = encodeFunctionData({
      // abi: parseAbi(["function add(int256 a, int256 b) pure returns (int256)"]),
      abi: parsedAbi as any, // any-cast due to dynamic abis
      functionName: "add",
      args: [BigInt(1), BigInt(2)],
    });

    expect(calldata).toBe(
      "0xa5f3c23b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002"
    );

    // const ABIPARAM: string = "string x, uint y, bool z";
    // const abi = parseAbi([ABI]);
    // console.log(abi);
    // const encodedData = encodeAbiParameters(parseAbiParameters(ABIPARAM), ["wagmi", BigInt(420), true]);

    // console.log(encodedData);
    //0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001a4000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000057761676d69000000000000000000000000000000000000000000000000000000
  });
});
