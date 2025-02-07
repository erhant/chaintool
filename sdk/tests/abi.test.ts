import { describe, expect, test } from "bun:test";
import { AbiFunction, encodeFunctionData, parseAbi } from "viem";

describe("abi encodings", () => {
  const VITALIK_ADDR = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045";
  test("addition", () => {
    const ABI: string[] = ["function add(int256 a, int256 b) pure returns (int256 c)"];
    const parsedAbi = parseAbi(ABI) as AbiFunction[];
    expect(parsedAbi.length).toBe(1);
    expect(parsedAbi[0].name).toBe("add");
    expect(parsedAbi[0].inputs.length).toBe(2);
    expect(parsedAbi[0].outputs.length).toBe(1);
    expect(parsedAbi[0].stateMutability).toBe("pure");

    const calldata = encodeFunctionData({
      abi: parsedAbi,
      functionName: "add",
      args: [1n, 2n],
    });

    expect(calldata).toBe(
      "0xa5f3c23b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002"
    );
  });

  test("erc20", () => {
    const ABI: string[] = [
      "function balanceOf(address _owner) external view returns (uint256 balance)",
      "function transfer(address _to, uint256 _value) external returns (bool success)",
    ];
    const parsedAbi = parseAbi(ABI) as AbiFunction[];
    expect(parsedAbi.length).toBe(2);

    expect(parsedAbi[0].name).toBe("balanceOf");
    expect(parsedAbi[0].inputs.length).toBe(1);
    expect(parsedAbi[0].outputs.length).toBe(1);
    expect(parsedAbi[0].stateMutability).toBe("view");
    const calldata1 = encodeFunctionData({
      abi: parsedAbi,
      functionName: "balanceOf",
      args: [VITALIK_ADDR],
    });
    expect(calldata1).toBe("0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045");

    expect(parsedAbi[1].name).toBe("transfer");
    expect(parsedAbi[1].inputs.length).toBe(2);
    expect(parsedAbi[1].outputs.length).toBe(1);
    expect(parsedAbi[1].stateMutability).toBe("nonpayable");
    const calldata2 = encodeFunctionData({
      abi: parsedAbi,
      functionName: "transfer",
      args: [VITALIK_ADDR, 123],
    });
    expect(calldata2).toBe(
      "0xa9059cbb000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045000000000000000000000000000000000000000000000000000000000000007b"
    );
  });
});
