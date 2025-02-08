// Web3 Experience Survey Data to add to the collection
// $allot signals that the name years_in_web3 field will be encrypted
// Each node will have a different encrypted $share of encrypted field
export const data = [
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
];
