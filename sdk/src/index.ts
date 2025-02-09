import dotenv from "dotenv";
import readline from "readline";
import { initializeAgent } from "./agent/initialize";
import { validateEnvironment } from "./env";
import { runAutonomousMode } from "./agent/modes/auto";
import { runChatMode } from "./agent/modes/chat";
import { nillionOrgConfig } from "./agent/tools/nillion/config";

/**
 * Main entry point
 */
async function main() {
  dotenv.config();
  validateEnvironment();

  // configure a file to persist the agent's CDP MPC Wallet Data
  const CDP_MPC_WALLET_PATH = "./secrets/cdp_mpc_wallet_data.json";

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const agentInit = await initializeAgent(CDP_MPC_WALLET_PATH, "gpt-4o", "Chaintool CDP-Agent", {
      config: nillionOrgConfig,
      schemaId: "c2b439c9-76a5-4c03-9355-ee70161182f3",
    });

    const question = (prompt: string): Promise<string> => new Promise((resolve) => rl.question(prompt, resolve));

    let exit = false;
    while (!exit) {
      console.log("\nSelect an option:");
      console.log("chat\tInteractively chat with your Agent.");
      console.log("auto\tLet your agent loose, make it autonomous.");
      console.log("exit\tQuit the agent (CTRL+C works too).");

      const CHOICES = ["chat", "auto"] as const;
      type CHOICES = (typeof CHOICES)[number];
      const choice = (await question("\nChoose a mode by typing its name: ")).toLowerCase().trim() as CHOICES | "exit";

      switch (choice) {
        case "chat": {
          await runChatMode(agentInit, rl);
          break;
        }
        case "auto": {
          await runAutonomousMode(agentInit);
          break;
        }
        case "exit": {
          console.log("Bye bye!");
          exit = true;
          break;
        }
        default: {
          choice satisfies never;
          console.log(`Invalid choice, please try again from (${CHOICES.join(", ")}).`);
          break;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    throw error;
  } finally {
    rl.close();
  }
}

// start the agent when running directly
if (require.main === module) {
  main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
}
