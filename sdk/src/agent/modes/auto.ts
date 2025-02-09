import { HumanMessage } from "@langchain/core/messages";
import type { AgentInit } from "../initialize";

/** Run the agent autonomously with specified intervals. */
export async function runAutonomousMode({ agent, config }: AgentInit, interval_secs = 10) {
  console.log("Starting autonomous mode...");
  while (true) {
    const thought = `Be creative and do something interesting on the blockchain. 
Choose an action or set of actions and execute it that highlights your abilities.

Be aware that you may have Chaintools that may be useful for you, so you can use them to help you in your task.
If you dont know which Chaintools are available, use your actions get them, or get the available categories and search for its Chaintools.
    `;

    const stream = await agent.stream({ messages: [new HumanMessage(thought)] }, config);

    for await (const chunk of stream) {
      if ("agent" in chunk) {
        console.log(chunk.agent.messages[0].content);
      } else if ("tools" in chunk) {
        console.log(chunk.tools.messages[0].content);
      }
      console.log("-------------------");
    }

    await new Promise((resolve) => setTimeout(resolve, interval_secs * 1000));
  }
}
