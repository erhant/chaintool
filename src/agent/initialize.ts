import {
  AgentKit,
  CdpWalletProvider,
  wethActionProvider,
  walletActionProvider,
  erc20ActionProvider,
  cdpApiActionProvider,
  cdpWalletActionProvider,
  pythActionProvider,
} from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs";
import { messageSigner } from "./tools/sign";

// list of allowed models for this agent
const OpenAIModel = [
  "gpt-4-turbo",
  "gpt-4o",
  "gpt-4o-mini",
  "o1-mini",
  "o1-preview",
] as const;
type OpenAIModel = (typeof OpenAIModel)[number];

/** Agent initialization type as per the return type of `initializeAgent`. */
export type AgentInit = Awaited<ReturnType<typeof initializeAgent>>;
/**
 * Initialize the agent with CDP Agentkit
 *
 * @param walletDataPath - Path to the wallet data file, e.g. "wallet_data.json"
 * @returns Agent executor and config
 */
export async function initializeAgent(
  walletDataPath: string,
  model: OpenAIModel,
  agentName: string
) {
  const llm = new ChatOpenAI({ model });

  let walletDataStr: string | undefined = undefined;

  // Read existing wallet data if available
  if (fs.existsSync(walletDataPath)) {
    try {
      walletDataStr = fs.readFileSync(walletDataPath, "utf8");
    } catch (error) {
      console.error("Error reading wallet data:", error);
      // Continue without wallet data
    }
  }

  // Configure CDP Wallet Provider
  const config: NonNullable<
    Parameters<typeof CdpWalletProvider.configureWithWallet>[0]
  > = {
    apiKeyName: process.env.CDP_API_KEY_NAME,
    apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
    cdpWalletData: walletDataStr,
    networkId: process.env.NETWORK_ID || "base-sepolia",
  };

  // create wallet provider
  const walletProvider = await CdpWalletProvider.configureWithWallet(config);

  // initialize AgentKit
  const agentkit = await AgentKit.from({
    walletProvider,
    actionProviders: [
      wethActionProvider(),
      pythActionProvider(),
      walletActionProvider(),
      erc20ActionProvider(),
      cdpApiActionProvider({
        apiKeyName: config.apiKeyName,
        apiKeyPrivateKey: config.apiKeyPrivateKey,
      }),
      cdpWalletActionProvider({
        apiKeyName: config.apiKeyName,
        apiKeyPrivateKey: config.apiKeyPrivateKey,
      }),
      messageSigner,
    ],
  });

  const tools = await getLangChainTools(agentkit);

  // Store buffered conversation history in memory
  const memory = new MemorySaver();

  // Create React Agent using the LLM and CDP AgentKit tools
  const agent = createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
    messageModifier: `
You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
funds from the user. Before executing your first action, get the wallet details to see what network 
you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
asks you to do something you can't do with your currently available tools, you must say so, and 
encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
docs.cdp.coinbase.com for more information. Be concise and helpful with your responses. Refrain from 
restating your tools' descriptions unless it is explicitly requested.
        `,
  });

  // Save wallet data
  const exportedWallet = await walletProvider.exportWallet();
  fs.writeFileSync(walletDataPath, JSON.stringify(exportedWallet));

  return {
    agent,
    config: {
      configurable: { thread_id: agentName },
    },
  };
}
