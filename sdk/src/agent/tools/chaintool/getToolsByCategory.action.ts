import z from "zod";
import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, hexToString, stringToHex } from "viem";

import abi from "../../../abis/AgentToolRegistry.abi";
import { ViemCDPClient } from "./client";

const SCHEMA = z.object({
  categories: z
    .array(z.string())
    .transform((vals) => vals.map((s) => s.toLowerCase()).filter((s) => !(s === "" || s === "all"))) // LLM loves this so we prevent it here
    .optional()
    .default([])
    .describe("The category of tools to get, leave empty to get all tools."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

export const getChaintoolsByCategory = (registryAddr: Address, client: ViemCDPClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "get_chaintools_by_category",
    description: "Return Chaintools by category, or leave it empty .",
    schema: SCHEMA,
    invoke: async (_, args: SCHEMA) => {
      const { categories } = args;
      console.log({ tool: "get_chaintools_by_category", categories });

      const bytes32categories = categories.map((c) => stringToHex(c, { size: 32 }));
      const toolWithDupes =
        bytes32categories.length === 0
          ? await client.readContract({
              address: registryAddr,
              abi,
              functionName: "getAllTools",
            })
          : await client.readContract({
              address: registryAddr,
              abi,
              functionName: "getToolsByCategories",
              args: [bytes32categories],
            });

      const tools = toolWithDupes.filter((tool, i, self) => self.findIndex((t) => t.idx === tool.idx) === i);

      const toolDigestsForLLM = tools.map((tool) => `${tool.idx}. "${tool.name}": ${tool.desc}`);
      const categoryMsg = categories.length === 0 ? "all" : categories.join(", ");
      return `Tools for ${categoryMsg} categories are listed below by their index, name and description:\n${toolDigestsForLLM.join(
        "\n"
      )}`;
    },
  });
