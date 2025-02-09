/**
 * A schema to represent a Chaintool usage.
 * Schema ID: 4359049f-7ba6-43e5-be3c-4a511dc86783 (created via test)
 * See also: https://docs.nillion.com/build/secret-vault-quickstart
 */
export const nillionSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Chaintool Usages",
  type: "array",
  items: {
    type: "object",
    properties: {
      _id: {
        type: "string",
        format: "uuid",
        coerce: true,
      },
      // tool index
      index: {
        type: "object",
        properties: {
          $share: {
            type: "string",
          },
        },
        required: ["$share"],
      },
      // tool name
      name: {
        type: "object",
        properties: {
          $share: {
            type: "string",
          },
        },
        required: ["$share"],
      },
      // tool description
      description: {
        type: "object",
        properties: {
          $share: {
            type: "string",
          },
        },
        required: ["$share"],
      },
    },
    required: ["_id", "index", "name", "description"],
  },
} as const;
