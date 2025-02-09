import { customActionProvider } from "@coinbase/agentkit";
import { NillionOrgConfig } from "./config";
// @ts-expect-error --- nillion does not have types...
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import z from "zod";

const SCHEMA = z.object({
  index: z.number().describe("The chaintool index."),
  name: z.string().describe("The name of the chaintool"),
  description: z.string().describe("The description of the chaintool"),
});
type SCHEMA = z.infer<typeof SCHEMA>;

export const nillionWrite = (config: NillionOrgConfig, schemaId: string) =>
  customActionProvider({
    name: "nillion_write_vault",
    description: "Write Chaintool to Nillion nodes to keep a historical record.",
    schema: SCHEMA,
    invoke: async (_, data: SCHEMA) => {
      console.log({ tool: "nillion_write_vault", data });
      const encryptableData = {
        index: { $allot: data.index },
        name: { $allot: data.name },
        description: { $allot: data.description },
      };

      const collection = new SecretVaultWrapper(config.nodes, config.orgCredentials, schemaId);
      await collection.init();

      const result = await collection.writeToNodes([encryptableData]);
      const newIds = [...new Set(result.map((item: any) => item.result.data.created).flat())];

      return JSON.stringify({ recordIds: newIds }, null, 2);
    },
  });
