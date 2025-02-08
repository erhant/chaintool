// @ts-expect-error --- nillion does not have types...
import { SecretVaultWrapper } from "nillion-sv-wrappers";
import { NillionOrgConfig } from "./config";

// Use postSchema.js to create a new collection schema
// Update SCHEMA_ID to the schema id of your new collection
const SCHEMA_ID = "🎯UPDATE_ME_WITH_YOUR_SCHEMA_ID";

export async function createSchema(orgConfig: NillionOrgConfig, schema: object) {
  try {
    const org = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials);
    await org.init();

    // Create a new collection schema for all nodes in the org
    const collectionName = "Web3 Experience Survey";
    const newSchema = await org.createSchema(schema, collectionName);
    console.log("✅ New Collection Schema created for all nodes:", newSchema);
    console.log("👀 Schema ID:", newSchema[0].result.data);
  } catch (error) {
    // TODO: remove catch
    if (error instanceof Error) {
      console.error("❌ Failed to use SecretVaultWrapper:", error.message);
    }
    process.exit(1);
  }
}

export async function writeAndRead(orgConfig: NillionOrgConfig, data: object[]) {
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials, SCHEMA_ID);
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
  } catch (error) {
    // TODO: remove catch
    if (error instanceof Error) {
      console.error("❌ SecretVaultWrapper error:", error.message);
    }
    process.exit(1);
  }
}
