import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import z from "zod";

const SCHEMA = z.object({
  name: z.string().describe("The name of the tool"),
  // TODO: get args to be abi-encoded here
});
type SCHEMA = z.infer<typeof SCHEMA>;

export const messageSigner = customActionProvider<EvmWalletProvider>({
  name: "sign_message",
  description: "Sign arbitrary messages using EIP-191 Signed Message Standard hashing",
  schema: SCHEMA,
  invoke: async (walletProvider, args: SCHEMA) => {
    // TODO: !!!
  },
});
