import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import z from "zod";
import abi from "../../../abis/AgentToolRegistry.abi";
import { Address, createWalletClient, Hex, publicActions, PublicClient } from "viem";
import { createPublicClient, http } from "viem";
import { anvil, baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

export type ViemClient = ReturnType<typeof createPublicClient>;
export function createViemClient(privateKey: Hex) {
  return createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: anvil, // TODO: !!!
    transport: http(),
  }).extend(publicActions);
}

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
