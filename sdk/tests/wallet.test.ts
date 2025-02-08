import { describe, expect, test, it } from "bun:test";
import { AbiFunction, encodeFunctionData, parseAbi } from "viem";
import { HDKey, hdKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

describe("abi encodings", () => {
  it("addition", () => {
    const hdKey = HDKey.fromMasterSeed(
      Buffer.from("c323022551b104e77d370aaa303dc43dc02c7b7fc279db4f8728ad86fe2d76d5", "hex")
    );

    const account = hdKeyToAccount(hdKey);

    console.log(account.address);
    // 0x4bF825602483D9D4f8f46CC0cc2d02272BD4909C
  });
});
