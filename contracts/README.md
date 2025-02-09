# Chaintool: Contracts

This folder contains the contracts & their scripts to deploy & register to `AgentToolRegistry`. The registry is deployed at:

- **Base Sepolia**: [`0x5d29f6180A7a3D02623c1F74e4244C53beAA1c53`](https://base-sepolia.blockscout.com/address/0x5d29f6180A7a3D02623c1F74e4244C53beAA1c53)

## Installation

Clone the repository:

```sh
git clone https://github.com/erhant/chaintools
cd chaintools/contracts
```

Install all dependencies:

```sh
forge install && bun install
```

We used `solc 0.8.28` as our Solidity compiler.

## Usage

### Deployment & Registration

Deploy the registry with:

```sh
forge create src/AgentTools.sol:AgentToolRegistry \
  --rpc-url $RPC_URL --broadcast \
  --private-key $PRIVATE_KEY
```

Use the deployment scripts to register (and deploy) tools, for example:

```sh
REGISTRY=0x5d29f6180A7a3D02623c1F74e4244C53beAA1c53 \
forge script script/Tools.s.sol:$TOOL_NAME_HERE \
  --rpc-url $RPC_URL --broadcast \
  --private-key $PRIVATE_KEY
```

> [!WARNING]
>
> Some tools may require extra arguments via env variables, please check the tool script for more detail.

### ABIs

Export ABI to clipboard with:

```sh
forge inspect AgentToolRegistry abi | pbcopy
```

Setup everything for testing with `setup.sh`.

### Verification

You can verify a contract on Base Sepolia with `forge verify-contract`. For example:

```sh
forge verify-contract 0x5d29f6180A7a3D02623c1F74e4244C53beAA1c53 AgentToolRegistry \
--verifier blockscout \
--verifier-url https://base-sepolia.blockscout.com/api/ \
--compiler-version 0.8.28
--chain-id 84532
```

### Testing

Test contracts with:

```sh
forge test
```
