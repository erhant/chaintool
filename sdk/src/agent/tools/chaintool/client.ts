import { Address, createWalletClient, Hex, publicActions } from "viem";
import { http } from "viem";
import { anvil, base, baseSepolia } from "viem/chains";
import { hdKeyToAccount, HDKey } from "viem/accounts";

/** Alias for return type of `createViemClient`. */
export type ViemCDPClient = ReturnType<typeof createViemClient>;

/** Supported chains. */
export type ViemCDPChains = typeof anvil | typeof baseSepolia | typeof base;

/**
 * Create a Viem client with the given master seed (from CDP) and a chain.
 * @param masterSeed seed for HD wallet, can be obtained from CDP MPC Wallet data
 * @param chain chain to connect to (must be: anvil or baseSepolia)
 * @returns a Viem wallet client with extended public actions
 */
export function createViemClient(masterSeed: Uint8Array, chain: ViemCDPChains) /* infer */ {
  return createWalletClient({
    account: hdKeyToAccount(HDKey.fromMasterSeed(masterSeed)),
    chain,
    transport: chain.name === "Anvil" ? http("http://localhost:8545") : http(),
  }).extend(publicActions);
}
