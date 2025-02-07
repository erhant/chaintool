import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { AbiFunction, Address, hexToString, parseAbi, isAddress } from "viem";
import abi from "../../../abis/AgentToolRegistry.abi";
import z from "zod";
import { ViemClient } from ".";

const SCHEMA = z.object({
  abitype: z.string().describe("The selected function abi type from the tool."),
  target: z.custom<Address>(isAddress, "Invalid Address").describe("The address of the tool."),
  toolArgs: z.array(z.unknown()).describe("An array of arguments, respecting the function abi type."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

// just an example tool from the docs
export const useToolAction = (client: ViemClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "use_onchain_tool",
    description: "Uses an on-chain tool by calling its function with the given abi type and target.",
    schema: SCHEMA,
    invoke: async (walletProvider, args: SCHEMA) => {
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
