import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, hexToString } from "viem";
import abi from "../../../abis/AgentToolRegistry.abi";
import z from "zod";
import { ViemClient } from ".";

const SCHEMA = z.object({
  toolIndex: z.number().describe("The tool index to check, you should get this index after you observe the tools."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const observeToolsAbisAction = (registryAddr: Address, client: ViemClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "get_onchain_tool_by_index",
    description: "Returns the details of an on-chain tool at the given index, to further list its functionalities.",
    schema: SCHEMA,
    invoke: async (walletProvider, args: SCHEMA) => {
      const { toolIndex } = args;

      console.log("Checking tool index", toolIndex);

      // make a call with its abi
      const tool = await client.readContract({
        address: registryAddr,
        abi,
        functionName: "getTool",
        args: [BigInt(toolIndex)],
      });
      console.log({ tool });

      return `The tool: ${tool.name} at address ${
        tool.target
      } has the following functions defined by their ABI types:\n${tool.abitypes.map((s) => ` - \`${s}\``).join("\n")}`;
    },
  });
