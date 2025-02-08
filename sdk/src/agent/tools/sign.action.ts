import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import z from "zod";

const SCHEMA = z.object({
  message: z.string().describe("The message to sign"),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const messageSigner = customActionProvider<EvmWalletProvider>({
  name: "sign_message",
  description: "Sign arbitrary messages using EIP-191 Signed Message Standard hashing",
  schema: SCHEMA,
  invoke: async (walletProvider, args: SCHEMA) => {
    const { message } = args;
    const signature = await walletProvider.signMessage(message);

    return `The payload signature: ${signature}`;
  },
});
