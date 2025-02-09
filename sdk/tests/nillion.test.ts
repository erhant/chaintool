import { beforeAll, describe, expect, test } from "bun:test";
import { createNillionSchema, writeAndRead } from "../src/agent/tools/nillion";
import { nillionOrgConfig } from "../src/agent/tools/nillion/config";
import { nillionSchema } from "../src/agent/tools/nillion/schema";

describe("nillion example", () => {
  let schemaId: string = "33a26de1-d663-45aa-b699-ebc8d0bf09f4";

  test("create schema", async () => {
    schemaId = await createNillionSchema(nillionOrgConfig, nillionSchema);
    console.log("schema-id:", schemaId);
    // schema-id: 33a26de1-d663-45aa-b699-ebc8d0bf09f4
  });

  test("write and read", async () => {
    // Web3 Experience Survey Data to add to the collection
    // $allot signals that the name years_in_web3 field will be encrypted
    // Each node will have a different encrypted $share of encrypted field
    await writeAndRead(nillionOrgConfig, schemaId, [
      {
        name: { $allot: "Vitalik Buterin" }, // will be encrypted to a $share
        years_in_web3: { $allot: 8 }, // will be encrypted to a $share
        responses: [
          { rating: 5, question_number: 1 },
          { rating: 3, question_number: 2 },
        ],
      },
      {
        name: { $allot: "Satoshi Nakamoto" }, // will be encrypted to a $share
        years_in_web3: { $allot: 14 }, // will be encrypted to a $share
        responses: [
          { rating: 2, question_number: 1 },
          { rating: 5, question_number: 2 },
        ],
      },
    ]);
  });
});
