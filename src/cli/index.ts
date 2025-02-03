import dotenv from "dotenv";
import readline from "readline";
import { initializeAgent } from "../agent/initialize";
import { validateEnvironment } from "./environment";
import { runAutonomousMode } from "../agent/auto";
import { runChatMode } from "../agent/chat";

/**
 * Main entry point
 */
async function main() {
  dotenv.config();
  validateEnvironment();

  // configure a file to persist the agent's CDP MPC Wallet Data
  const WALLET_DATA_FILE = "wallet_data.json";

  try {
    const agentInit = await initializeAgent(WALLET_DATA_FILE, "gpt-4o-mini");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (prompt: string): Promise<string> =>
      new Promise((resolve) => rl.question(prompt, resolve));

    while (true) {
      console.log("Available modes:");
      console.log("1. chat    - Interactive chat mode");
      console.log("2. auto    - Autonomous action mode");

      const choice = (
        await question("\nChoose a mode (enter number or name): ")
      )
        .toLowerCase()
        .trim();

      if (choice === "1" || choice === "chat") {
        rl.close();
        await runChatMode(agentInit);
      } else if (choice === "2" || choice === "auto") {
        rl.close();
        await runAutonomousMode(agentInit);
      }
      console.log("Invalid choice. Please try again.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}

// start the agent when running directly
if (require.main === module) {
  console.log("Starting Agent...");
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}
