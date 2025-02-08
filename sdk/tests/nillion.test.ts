import { beforeAll, describe, expect, test } from "bun:test";
import { createNillionSchema, writeAndRead } from "../src/agent/tools/nillion";

const nillionSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Web3 Experience Survey",
  type: "array",
  items: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        format: "uuid",
        coerce: true,
      },
      name: {
        type: "object",
        properties: {
          $share: {
            type: "string",
          },
        },
        required: ["$share"],
      },
      years_in_web3: {
        type: "object",
        properties: {
          $share: {
            type: "string",
          },
        },
        required: ["$share"],
      },
      responses: {
        type: "array",
        items: {
          type: "object",
          properties: {
            rating: {
              type: "integer",
              minimum: 1,
              maximum: 5,
            },
            question_number: {
              type: "integer",
              minimum: 1,
            },
          },
          required: ["rating", "question_number"],
        },
        minItems: 1,
      },
    },
    required: ["_id", "name", "years_in_web3", "responses"],
  },
} as const;

export type NillionOrgCredentials = {
  secretKey: string;
  orgDid: string;
};

export type NillionNode = {
  url: string;
  did: string;
};

export type NillionOrgConfig = {
  orgCredentials: NillionOrgCredentials;
  nodes: NillionNode[];
};

// demo org credentials
export const orgConfig: NillionOrgConfig = {
  // in a production environment, make sure to put your org's credentials in environment variables
  orgCredentials: {
    secretKey: process.env.NILLION_SECRET_KEY ?? "a786abe58f933e190d01d05b467838abb1e391007a674d8a3aef106e15a0bf5a", // demo
    orgDid: process.env.NILLION_ORG_ID ?? "did:nil:testnet:nillion1vn49zpzgpagey80lp4xzzefaz09kufr5e6zq8c", // demo
  },
  // demo node config
  nodes: [
    {
      url: "https://nildb-zy8u.nillion.network",
      did: "did:nil:testnet:nillion1fnhettvcrsfu8zkd5zms4d820l0ct226c3zy8u",
    },
    {
      url: "https://nildb-rl5g.nillion.network",
      did: "did:nil:testnet:nillion14x47xx85de0rg9dqunsdxg8jh82nvkax3jrl5g",
    },
    {
      url: "https://nildb-lpjp.nillion.network",
      did: "did:nil:testnet:nillion167pglv9k7m4gj05rwj520a46tulkff332vlpjp",
    },
  ],
};

describe("nillion example", () => {
  let schemaId: string = "33a26de1-d663-45aa-b699-ebc8d0bf09f4";

  test("create schema", async () => {
    schemaId = await createNillionSchema(orgConfig, nillionSchema);
    console.log("schema-id:", schemaId);
    // schema-id: 33a26de1-d663-45aa-b699-ebc8d0bf09f4
  });

  test("write and read", async () => {
    // Web3 Experience Survey Data to add to the collection
    // $allot signals that the name years_in_web3 field will be encrypted
    // Each node will have a different encrypted $share of encrypted field
    await writeAndRead(orgConfig, schemaId, [
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
