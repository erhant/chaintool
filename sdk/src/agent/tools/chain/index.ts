import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import z from "zod";
import abi from "../../../abis/AgentToolRegistry.abi";
import { Address, Hex, PublicClient } from "viem";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";

const SCHEMA = z.object({
  name: z.string().describe("The name of the tool"),
  // TODO: get args to be abi-encoded here
});
type SCHEMA = z.infer<typeof SCHEMA>;

export const onchainToolsProvider = async (
  client: PublicClient,
  registryAddr: Hex,
  filter?: {
    /** `bytes32` of a string. */
    category?: Hex | Hex[] | null; // TODO: do the typecast yourself?
    owner?: Address | Address[] | null;
  }
) => {
  // get tool events from chain for your category
  const logs = await client.getContractEvents({
    address: registryAddr,
    abi,
    eventName: "ToolRegistered",
    args: filter,
  });
  console.log(logs);

  // TODO: !!!
  // return the provider
  // return customActionProvider<EvmWalletProvider>({
  //   name: "onchain_tool_checker",
  //   description: "Check on-chain tools.",
  //   schema: SCHEMA,
  //   invoke: async (walletProvider, args: SCHEMA) => {
  //     // TODO: !!!
  //   },
  // });
};
