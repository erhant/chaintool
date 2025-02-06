import { beforeAll, describe, test } from "bun:test";
import {
  bytesToString,
  createPublicClient,
  encodeFunctionData,
  fromBytes,
  hexToString,
  http,
  PublicClient,
} from "viem";
import { anvil } from "viem/chains";
import abi from "../src/abis/AgentToolRegistry.abi";
import { privateKeyToAccount } from "viem/accounts";

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

function createClient() {
  return createPublicClient({
    chain: anvil,
    transport: http(),
  });
}

describe("chain calls", () => {
  const registryAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  let client: ReturnType<typeof createClient>;

  beforeAll(() => {
    client = createClient();
  });

  test("addition", async () => {
    // get tools via events
    const toolEventLogs = await client.getContractEvents({
      address: registryAddr,
      abi,
      eventName: "ToolRegistered",
      // args: filter,
    });

    const toolMetadata = toolEventLogs.map((log) => ({
      ...log.args,
      idx: BigInt(log.args.idx ?? 0), // TODO: ?? done due to undefined thing
      category: hexToString(log.args.category ?? "0x", { size: 32 }),
    }));

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

    console.log(tools);

    // make a call with its abi
    // TODO: get abis from chosen tool, and call addition
  });
});
