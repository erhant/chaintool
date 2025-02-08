import z from "zod";
import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, AbiFunction, parseAbi, isAddress } from "viem";
import { ViemCDPClient } from "./client";

const SCHEMA = z.object({
  abitype: z.string().describe("The selected function abi type from the tool, must include the entire ABI type."),
  target: z.custom<Address>(isAddress, "Invalid Address").describe("The address of the tool."),
  toolArgs: z.array(z.unknown()).describe("An array of arguments, respecting the function abi type."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const useToolAction = (client: ViemCDPClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "use_chaintool",
    description: "Use a Chaintool by calling its function with the given abi type and target.",
    schema: SCHEMA,
    invoke: async (_, args: SCHEMA) => {
      const { target, abitype, toolArgs } = args;
      console.log({ target, abitype, toolArgs });

      const parsedAbi = (parseAbi([abitype]) as AbiFunction[])[0];
      console.log(parsedAbi);

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
        });
        // TODO: mine tx as well
        console.log(result);
        return `Function "${parsedAbi.name}" called with args ${toolArgs} returned: ${result}`;
      }
    },
  });
