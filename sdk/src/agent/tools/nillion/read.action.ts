import { customActionProvider } from "@coinbase/agentkit";
import { NillionOrgConfig } from "./config";
// @ts-expect-error --- nillion does not have types...
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import z from "zod";

const SCHEMA = z.object({
  limit: z.number().optional().describe("Optional number of data items to fetch."),
});
type SCHEMA = z.infer<typeof SCHEMA>;

export const nillionRead = (config: NillionOrgConfig, schemaId: string) =>
  customActionProvider({
    name: "nillion_read_vault",
    description:
      "Read from Nillion SecretVault to remember the Chaintools that you have used. Only do this when you are prompted to do so, or once at the very start.",
    schema: SCHEMA,
    invoke: async (_, args: SCHEMA) => {
      const { limit } = args;
      console.log({ tool: "nillion_read_vault", limit });

      const collection = new SecretVaultWrapper(config.nodes, config.orgCredentials, schemaId);
      await collection.init();

      const nodeData = (await collection.readFromNodes({ limit })) as {
        _id: string;
        index: bigint;
        name: string;
        description: string;
      }[];
      // console.log({ nodeData });
      const data = nodeData.map((d) => ({
        index: Number(d.index),
        name: d.name,
        description: d.description,
      }));

      return `The following Chaintools have been used as per your Nillion vault:\n${data
        .map((tool) => `${tool.index}. "${tool.name}": ${tool.description}`)
        .join("\n")}`;
    },
  });
