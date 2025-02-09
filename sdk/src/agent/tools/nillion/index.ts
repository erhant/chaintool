// @ts-expect-error --- nillion does not have types...
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { NillionOrgConfig } from "./config";

export * from "./read.action";
export * from "./write.action";

export async function createNillionSchema(orgConfig: NillionOrgConfig, schema: object) {
  const org = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials);
  await org.init();

  // Create a new collection schema for all nodes in the org
  const collectionName = "Web3 Experience Survey";
  const newSchema = await org.createSchema(schema, collectionName);
  console.log("✅ New Collection Schema created for all nodes:", newSchema);
  console.log("👀 Schema ID:", newSchema[0].result.data); // TODO: return this
  return newSchema[0].result.data;
}

export async function writeAndRead(orgConfig: NillionOrgConfig, schemaId: string, data: object[]) {
  // Create a secret vault wrapper and initialize the SecretVault collection to use
  const collection = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials, schemaId);
  await collection.init();

  // Write collection data to nodes encrypting the specified fields ahead of time
  const dataWritten = await collection.writeToNodes(data);
  console.log("👀 Data written to nodes:", JSON.stringify(dataWritten, null, 2));

  // Get the ids of the SecretVault records created
  const newIds = [...new Set(dataWritten.map((item: any /* TODO: type */) => item.result.data.created).flat())];
  console.log("uploaded record ids:", newIds);

  // Read all collection data from the nodes, decrypting the specified fields
  const decryptedCollectionData = await collection.readFromNodes({});

  // Log first 5 records
  console.log("Most recent records", decryptedCollectionData.slice(0, data.length));
}
