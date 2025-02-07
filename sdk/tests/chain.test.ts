import { beforeAll, describe, expect, test } from "bun:test";
import {
  AbiFunction,
  bytesToString,
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  encodeFunctionData,
  fromBytes,
  Hex,
  hexToString,
  http,
  parseAbi,
  publicActions,
  PublicClient,
} from "viem";
import { anvil } from "viem/chains";
import abi from "../src/abis/AgentToolRegistry.abi";
import { privateKeyToAccount } from "viem/accounts";
import { tool } from "@langchain/core/tools";

// get tool events from chain for your category

// return the provider
// return customActionProvider<EvmWalletProvider>({
//   name: "onchain_tool_checker",
//   description: "Check on-chain tools.",
//   schema: SCHEMA,
//   invoke: async (walletProvider, args: SCHEMA) => {
//     // TODO: !!!
//   },
// });

function createClient(privateKey: Hex) {
  return createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: anvil,
    transport: http(),
  }).extend(publicActions);
}

describe("chain calls", () => {
  const registryAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let client: ReturnType<typeof createClient>;

  beforeAll(() => {
    client = createClient("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  });

  test("addition", async () => {
    // get tools via events
    const toolEventLogs = await client.getContractEvents({
      address: registryAddr,
      abi,
      eventName: "ToolRegistered",
      // args: filter,
    });

    // get metadata for tools, casting idx and category
    const toolMetadata = toolEventLogs.map((log) => ({
      ...log.args,
      idx: BigInt(log.args.idx ?? 0), // TODO: ?? done due to undefined thing
      category: hexToString(log.args.category ?? "0x", { size: 32 }),
    }));

    // read descriptions for each tool
    const toolDescriptions = await client.readContract({
      address: registryAddr,
      abi,
      functionName: "getDescriptions",
      args: [toolMetadata.map((tool) => tool.idx)],
    });

    // zip metadata with descriptions
    const tools = toolMetadata.map((tool, i) => ({
      ...tool,
      description: toolDescriptions[i],
    }));

    // make a call with its abi
    const tool = await client.readContract({
      address: registryAddr,
      abi,
      functionName: "getTool",
      args: [tools[0].idx],
    });
    console.log({ tool });

    expect(tool.abitypes[0]).toBe("function add(int256 a, int256 b) pure returns (int256)");
    const parsedAbi = (parseAbi([tool.abitypes[0]]) as AbiFunction[])[0];
    console.log(parsedAbi);

    const stateMut = parsedAbi.stateMutability;

    // `view` and `pure` are read-only
    if (stateMut === "view" || stateMut === "pure") {
      const result = await client.readContract({
        address: tool.target,
        abi: [parsedAbi],
        functionName: parsedAbi.name,
        // in this case we are calling `add` so its two numbers
        args: [4, 5],
      });

      console.log(result);
    } else {
      // `nonpayable` and `payable` are write-able
      const { request, result } = await client.simulateContract({
        address: tool.target,
        abi: [parsedAbi],
        functionName: parsedAbi.name,
        args: [4n, 5n],
      });
      console.log(result);
      const txHash = await client.writeContract(request);
    }
    // const calldata = encodeFunctionData({
    //   // abi: parseAbi(["function add(int256 a, int256 b) pure returns (int256)"]),
    //   abi: parsedAbi as any, // any-cast due to dynamic abis
    //   functionName: "add",
    //   args: [BigInt(1), BigInt(2)],
    // });

    // expect(calldata).toBe(
    //   "0xa5f3c23b00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002"
    // );
  });
});
