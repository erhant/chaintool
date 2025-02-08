import z from "zod";
import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, hexToString, stringToHex } from "viem";

import abi from "../../../abis/AgentToolRegistry.abi";
import { ViemCDPClient } from "./client";

const SCHEMA = z.object({
  categories: z
    .array(z.string())
    .transform((vals) => vals.map((s) => s.toLowerCase()).filter((s) => !(s === "" || s === "all"))) // LLM loves this so we prevent it here
    .describe("The category of tools to get, leave empty to get all tools."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

export const getToolsByCategory = (registryAddr: Address, client: ViemCDPClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "get_chaintools_by_category",
    description: "Return Chaintools, optionally filter by given categories.",
    schema: SCHEMA,
    invoke: async (walletProvider, args: SCHEMA) => {
      const { categories } = args;
      console.log({ tool: "get_chaintools_by_category", categories });

      // map to `bytes32`
      const bytes32categories = categories.map((c) => stringToHex(c, { size: 32 }));

      // get tools via events
      const toolEventLogs = await client.getContractEvents({
        address: registryAddr,
        abi,
        eventName: "ToolRegistered",
        args: {
          category: bytes32categories.length === 0 ? null : bytes32categories,
        },
        fromBlock: 21635860n, // just before the contract was deployed on base-sepolia
      });

      const toolMetadata = toolEventLogs
        // filter out duplicates by index
        .filter((log, i, self) => self.findIndex((l) => l.args.idx === log.args.idx) === i)
        .map((log) => ({
          ...log.args,
          idx: BigInt(log.args.idx ?? 0),
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

      const toolDigestsForLLM = tools.map((tool) => `${tool.idx}. "${tool.name}": ${tool.description}`);
      const categoryMsg = categories.length === 0 ? "all" : categories.join(", ");
      return `Tools for ${categoryMsg} categories are listed below by their index, name and description:\n${toolDigestsForLLM.join(
        "\n"
      )}`;
    },
  });
