import z from "zod";
import { customActionProvider, EvmWalletProvider } from "@coinbase/agentkit";
import { Address, hexToString, stringToHex } from "viem";

import abi from "../../../abis/AgentToolRegistry.abi";
import { ViemCDPClient } from "./client";

const SCHEMA = z.undefined();
type SCHEMA = z.infer<typeof SCHEMA>;

export const getChaintoolCategories = (registryAddr: Address, client: ViemCDPClient) =>
  customActionProvider<EvmWalletProvider>({
    name: "get_chaintool_categories",
    description: "Get all Chaintool categories so that you can later get category-specific Chaintools for your needs.",
    schema: SCHEMA,
    invoke: async () => {
      console.log({ tool: "get_chaintool_categories" });

      const bytes32categories = await client.readContract({
        address: registryAddr,
        abi,
        functionName: "getRegisteredCategories",
      });
      const categories = bytes32categories.map((c) => hexToString(c, { size: 32 }));

      return `Available Chaintools categories are: ${categories.join(", ")}`;
    },
  });
