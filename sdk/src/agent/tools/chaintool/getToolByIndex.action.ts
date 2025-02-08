import z from "zod";
import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address } from "viem";

import abi from "../../../abis/AgentToolRegistry.abi";
import { ViemCDPClient } from "./client";

const SCHEMA = z.object({
  toolIndex: z.number().describe("The tool index to check, you should get this index after you observe the tools."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const getToolByIndexAction = (registryAddr: Address, client: ViemCDPClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "get_chaintool_by_index",
    description: "Returns the details of a Chaintool at the given index, to further list its functionalities.",
    schema: SCHEMA,
    invoke: async (_, args: SCHEMA) => {
      const { toolIndex } = args;
      console.log({ tool: "getToolByIndexAction", toolIndex });

      // make a call with its abi
      const tool = await client.readContract({
        address: registryAddr,
        abi,
        functionName: "getTool",
        args: [BigInt(toolIndex)],
      });

      return `The tool: "${tool.name}" at address ${
        tool.target
      } has the following functions defined by their ABI types:\n${tool.abitypes.map((s) => ` - \`${s}\``).join("\n")}`;
    },
  });
