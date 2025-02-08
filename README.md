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

**Chaintool** is an EVM-compatible [smart-contract](https://base-sepolia.blockscout.com/address/0x9eD9db9C2fBD5B913635919BFb4784BcB941b7Fa) & AgentKit [action](https://github.com/coinbase/agentkit/blob/master/CONTRIBUTING-TYPESCRIPT.md#adding-an-action-provider) implementation, based on [CDP](https://portal.cdp.coinbase.com/) with [AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome) and [OnchainKit](https://onchainkit.xyz/getting-started). It allows Agents to access a wide variety of agentic-tools via the `AgentToolRegistry` contract, where registered tools can be queried per category.

Agents can read descriptions of tools (similar to how they do for local tools) and decide to use an on-chain tool. After deciding a tool, they can read the human-readable abitypes for that tool, and actually make a contract `call`/`send` depending on which function they want to use.

Tools can be added by anyone (although authorization is very easy to add), and agents can use these dynamically added tools while they are running; even if they didn't have access to them before. This avenues many possibilities to Agentic tools and their creators, e.g. tool marketplaces, tool-usage based reward mechanisms and so on!

## On-Chain Tool Calling

AgentKit supports tools within the code. This project aims to improve upon this by providing a tool-calling mechanism that is fed on-chain! This on-chain tool will be parsed by a single custom .

Here is a chat flow:

```diff
- First, fetch all chaintools for me.
+ AI uses `observeTools` action.
  ...
- Please get the details of the "Add" chaintool.
+ AI uses `observeToolAbis` action.
  ...
- Use this tool to add numbers 5 and 9 please.
+ AI uses `useTool` action.
```

Here is another

```diff
- Find all chaintools we have online.
+ AI uses `observeTools` action.
  ...
- Get details of "Tea Token" chaintool
+ AI uses `observeToolAbis` action.
  ...
- Tell me the Tea Token balance of address 0x5FbDB2315678afecb367f032d93F642f64180aa3
+ AI uses `useTool` action.
```
