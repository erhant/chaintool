import {
  AgentKit,
  CdpWalletProvider,
  walletActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs";
import { getChaintoolsByCategory } from "./tools/chaintool/getToolsByCategory.action";
import { getChaintoolByIndexAction } from "./tools/chaintool/getToolByIndex.action";
import { useChaintoolAction } from "./tools/chaintool/useTool.action";
import { createViemClient, ViemCDPChains } from "./tools/chaintool";
import { Address, Hex } from "viem";
import { z } from "zod";
import { anvil, base, baseSepolia } from "viem/chains";

// list of allowed models for this agent
const OpenAIModel = ["gpt-4-turbo", "gpt-4o", "gpt-4o-mini", "o1-mini", "o1-preview"] as const;
type OpenAIModel = (typeof OpenAIModel)[number];

const CdpWalletDataSchema = z.object({
  walletId: z.string(),
  seed: z.custom<Hex>((val) => /^[0-9a-fA-F]+$/.test(val), "Must be a hex string with 0x prefix"),
  networkId: z.union([z.literal("anvil"), z.literal("base"), z.literal("base-sepolia")]),
});
type CdpWalletDataSchema = z.infer<typeof CdpWalletDataSchema>;

/** Agent initialization type as per the return type of `initializeAgent`. */
export type AgentInit = Awaited<ReturnType<typeof initializeAgent>>;
/**
 * Initialize the agent with CDP Agentkit
 *
 * @param walletDataPath - Path to the wallet data file, e.g. "wallet_data.json"
 * @param model - OpenAI model to use
 * @param agentName - Name of the agent
 * @returns Agent executor and config
 */
export async function initializeAgent(walletDataPath: string, model: OpenAIModel, agentName: string) {
  const llm = new ChatOpenAI({ model });

  // Read existing wallet data if available
  let walletDataStr: string;
  if (fs.existsSync(walletDataPath)) {
    walletDataStr = fs.readFileSync(walletDataPath, "utf8");
  } else {
    const cdpConfig: NonNullable<Parameters<typeof CdpWalletProvider.configureWithWallet>[0]> = {
      apiKeyName: process.env.CDP_API_KEY_NAME,
      apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      cdpWalletData: undefined,
      networkId: process.env.NETWORK_ID ?? "base-sepolia",
    };

    // create wallet providers
    const cdpWalletProvider = await CdpWalletProvider.configureWithWallet(cdpConfig);
    const walletData = await cdpWalletProvider.exportWallet();
    walletDataStr = JSON.stringify(walletData);

    // save wallet data for later usage
    fs.writeFileSync(walletDataPath, walletDataStr);
  }

  const cdpWalletData = CdpWalletDataSchema.parse(JSON.parse(walletDataStr));

  let chain: ViemCDPChains;
  let registryAddress: Address;
  const networkId = process.env.NETWORK_ID || cdpWalletData.networkId;
  switch (networkId) {
    case "base-mainnet": {
      chain = base;
      throw new Error("A registry on Base is not yet deployed");
      break;
    }
    case "base-sepolia": {
      chain = baseSepolia;
      registryAddress = "0x9eD9db9C2fBD5B913635919BFb4784BcB941b7Fa";
      break;
    }
    default: {
      throw new Error("Invalid network ID: " + networkId);
    }
  }
  console.log("Using chain: ", chain.name);

  // Configure CDP Wallet Provider
  const cdpConfig: NonNullable<Parameters<typeof CdpWalletProvider.configureWithWallet>[0]> = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    cdpWalletData: walletDataStr, // CDP expects this as a string | undefined for some reason
    networkId: networkId,
  };

  // create wallet providers
  console.log("Creating CDP provider.");
  const cdpWalletProvider = await CdpWalletProvider.configureWithWallet(cdpConfig);
  console.log("Creating Viem client.");
  const viemClient = createViemClient(Buffer.from(cdpWalletData.seed, "hex"), chain);
  console.log("Agent address:", viemClient.account.address);
  console.log("Registry address:", registryAddress);
  // initialize AgentKit
  const agentkit = await AgentKit.from({
    walletProvider: cdpWalletProvider,
    actionProviders: [
      pythActionProvider(),
      walletActionProvider(),
      cdpApiActionProvider({
        apiKeyName: cdpConfig.apiKeyName,
        apiKeyPrivateKey: cdpConfig.apiKeyPrivateKey,
      }),
      cdpWalletActionProvider({
        apiKeyName: cdpConfig.apiKeyName,
        apiKeyPrivateKey: cdpConfig.apiKeyPrivateKey,
      }),
      // messageSigner,
      getChaintoolsByCategory(registryAddress, viemClient),
      getChaintoolByIndexAction(registryAddress, viemClient),
      useChaintoolAction(viemClient),
    ],
  });

  const tools = await getLangChainTools(agentkit);
  const memory = new MemorySaver(); // store buffered conversation history in memory
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.
You are empowered to interact onchain using your tools.

You also have access to a toolset called "Chaintool", which allows you to interact with arbitrary tools on-chain.
At any time, you can get available Chaintools by category, and then get a specific Chaintool details by its index.
If you decide to use a Chaintool, you can provide the target, abitype and arguments that you learn from its details to use it.

If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'.
If not, you can provide your wallet details and request funds from the user. 

Before executing your first action, get the wallet details to see what network you're on. 
If there is a 5XX (internal) HTTP error code, ask the user to try again later. 
If someone asks you to do something you can't do with your currently available tools, you must say so.

Be concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
        `,
  });

  return {
    agent,
    config: {
      configurable: { thread_id: agentName },
    },
  };
}
