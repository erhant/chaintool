import z from "zod";
import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, AbiFunction, parseAbi, isAddress, parseEther } from "viem";
import { ViemCDPClient } from "./client";

const SCHEMA = z.object({
  abitype: z.string().describe("The selected function abi type from the tool, must include the entire ABI type."),
  target: z
    .custom<Address>((d) => isAddress(d, { strict: false }), "Invalid Address")
    .describe("The address of the tool."),
  toolArgs: z.array(z.unknown()).optional().describe("An array of arguments, respecting the function abi type."),
  value: z
    .string()
    .refine((s) => {
      try {
        parseEther(s);
        return true;
      } catch {
        return false;
      }
    }, "not an ether value")
    .optional()
    .describe("The value to send with the transaction (optional) in ether units."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const useChaintoolAction = (client: ViemCDPClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "use_chaintool",
    description: "Use a Chaintool by calling its function with the given abi type and target.",
    schema: SCHEMA,
    invoke: async (_, args: SCHEMA) => {
      const { target, abitype, toolArgs, value } = args;
      console.log({ tool: "use_chaintool", target, abitype, toolArgs, value });

      const parsedAbi = (parseAbi([abitype]) as AbiFunction[])[0];

      const stateMut = parsedAbi.stateMutability;
      if (stateMut === "view" || stateMut === "pure") {
        // make a call
        const result = await client.readContract({
          address: target,
          abi: [parsedAbi],
          functionName: parsedAbi.name,
          // in this case we are calling `add` so its two numbers
          args: toolArgs,
        });

        console.log(result);
        return `Function "${parsedAbi.name}" called with args ${toolArgs} returned: ${result}`;
      } else {
        // make a transaction
        const { request, result } = await client.simulateContract({
          address: target,
          abi: [parsedAbi],
          functionName: parsedAbi.name,
          args: toolArgs,
          value: value ? parseEther(value) : undefined,
        });
        console.log(result);

        const txHash = await client.writeContract(request);

        console.log("Waiting for tx receipt for:", txHash);
        await client.waitForTransactionReceipt({ hash: txHash });

        return `Function "${parsedAbi.name}" called with args ${toolArgs} and mined in tx ${txHash} returned: ${result}`;
      }
    },
  });
