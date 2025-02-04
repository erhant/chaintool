import readline from "readline";
import type { AgentInit } from "../initialize";
import { HumanMessage } from "@langchain/core/messages";

/** Run the agent interactively based on user input. */
export async function runChatMode(
  { agent, config }: AgentInit,
  rl: readline.Interface
) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  while (true) {
    const userInput = await question("\nPrompt: ");

    if (userInput.toLowerCase() === "exit") {
      break;
    }

    const stream = await agent.stream(
      { messages: [new HumanMessage(userInput)] },
      config
    );

    for await (const chunk of stream) {
      console.debug({ chunk });

      if ("agent" in chunk) {
        console.log(chunk.agent.messages[0].content);
      } else if ("tools" in chunk) {
        console.log(chunk.tools.messages[0].content);
      }

      console.log("-------------------");
    }
  }
}
