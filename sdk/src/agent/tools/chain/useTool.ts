import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, hexToString } from "viem";
import abi from "../../../abis/AgentToolRegistry.abi";
import z from "zod";
import { ViemClient } from ".";

const SCHEMA = z.object({
  abitype: z.string().describe("The selected function abi type from the tool."),
  target: z.string().describe("The address of the tool."),
  args: z.unknown().describe("The arguments to pass to the function, respecting the ABI type."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const useToolAction = (registryAddr: Address, client: ViemClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "use_onchain_tool",
    description: "Uses an on-chain tool by calling its function with the given abi type and target.",
    schema: SCHEMA,
    invoke: async (walletProvider, actionArgs: SCHEMA) => {
      const { target, abitype, args } = actionArgs;

      console.log({ target, abitype, args });

      return "TODO!!!";
    },
  });
