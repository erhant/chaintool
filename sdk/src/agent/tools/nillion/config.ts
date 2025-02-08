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
