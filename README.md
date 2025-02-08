<p align="center">
  <img src="https://raw.githubusercontent.com/erhant/chaintools/refs/heads/main/misc/logo.png" alt="logo" width="142">
</p>

<p align="center">
  <h1 align="center">
    Chaintool
  </h1>
  <p align="center"><i>On-chain & dynamic toolchain for CDP AgentKit.</i></p>
</p>

<p align="center">
    <a href="./.github/workflows/test-contracts.yml" target="_blank">
        <img alt="Workflow: Contracts" src="https://github.com/erhant/chaintools/actions/workflows/test-contracts.yml/badge.svg">
    </a>
    <a href="https://opensource.org/licenses/MIT" target="_blank">
        <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    </a>
</p>

**Chaintool** is an EVM-compatible [smart-contract](https://base-sepolia.blockscout.com/address/0x9eD9db9C2fBD5B913635919BFb4784BcB941b7Fa) & AgentKit [action](https://github.com/coinbase/agentkit/blob/master/CONTRIBUTING-TYPESCRIPT.md#adding-an-action-provider) implementation, based on [CDP](https://portal.cdp.coinbase.com/) with [AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome) and [OnchainKit](https://onchainkit.xyz/getting-started), allowing AgentKit agents to access an endless variety of dynamically added agentic-tools just by looking at a **single smart contract**.

## Repository

We have three components in this monorepo:

- [AgentKit SDK](./sdk/)
- [Contracts](./contracts/)
- [Frontend](./web/) deployed at <https://chaintool.vercel.app/>

## Examples

See example usage of Chaintools with AgentKit [here](./sdk/README.md#usage).

## Methodology

A **Chaintool** is defined by a [Solidity struct](https://github.com/erhant/chaintools/blob/main/contracts/src/AgentTools.sol#L8), and is handled by the `AgentToolRegistry` contract. Each struct identifies an agentic tool with the following fields:

- `idx`: tool index, can be used to read details of a tool
- `name`: a short & descriptive tool name.
- `desc`: tool description, must be detailed enough for LLM to understand.
- `target`: a target Contract address for this tool.
- `abitypes`: an array of [human-readable ABI types](https://abitype.dev/api/human) for each function at the `target` that we expose as a tool.
- `categories`: an array of tool category strings (as `bytes32`) that an agent can query, e.g. `defi`, `math`, `erc20` and such.
- `owner`: owner of this tool

Here is an example Chaintool for a ERC20 token contract:

```solidity
string[] memory abis = new string[](5);
abis[0] = "function balanceOf(address _owner) external view returns (uint256 balance)";
abis[1] = "function transfer(address _to, uint256 _value) external returns (bool success)";
abis[2] = "function transferFrom(address _from, address _to, uint256 _value) external returns (bool success)";
abis[3] = "function approve(address _spender, uint256 _value) external returns (bool success)";
abis[4] = "function allowance(address _owner, address _spender) external view returns (uint256 remaining)";

bytes32[] memory categories = new bytes32[](2);
categories[0] = "defi";
categories[1] = "erc20";

AgentToolRegistry(registryAddress).register(
    tokenName, // e.g. "SHIB"
    "Exposes all ERC20 interface actions for the target token.",
    abis,
    categories,
    tokenAddress, // e.g. 0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce
    msg.sender // your address, or anything else
);
```

Agents can read descriptions of tools (similar to how they do for local tools) and decide to use an on-chain tool. After deciding a tool, they can read the human-readable abitypes for that tool, and actually make a contract `call`/`send` depending on which function they want to use. Agents can use these dynamically added tools while they are running; even if they didn't have access to them before.

Tools can be added by anyone for the current implementation, but it is trivial to add an arbitrary authorization mechanism to the registry contract. This avenues many possibilities to Agentic tools and their creators, e.g. tool marketplaces, tool-usage based reward mechanisms and so on!

## License

Chaintool is MIT-licensed.
