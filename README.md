# Re-agent

An Agent that can create more agents like itself, based on [CDP](https://portal.cdp.coinbase.com/) and [AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome). The repo is based on [this example](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#starting-from-scratch-with-langchain) and [this doc](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#add-custom-functionality-using-ai-or-manually).

Chaintool at: 0x9eD9db9C2fBD5B913635919BFb4784BcB941b7Fa (0.8.28)

verified with:

forge verify-contract 0x41803f815c0969E04D2414709f8fA416E30c1398 AddTool \
--verifier blockscout \
--verifier-url https://base-sepolia.blockscout.com/api/ \
--compiler-version 0.8.28
--chain-id 84532

## Setup

1. Create CDP API key, store in env
2. Set OPENAI API KEY in your env
3. Choose network

## On-Chain Tool Calling

AgentKit supports tools within the code. This project aims to improve upon this by providing a tool-calling mechanism that is fed on-chain! This on-chain tool will be parsed by a single custom [action](https://github.com/coinbase/agentkit/blob/master/CONTRIBUTING-TYPESCRIPT.md#adding-an-action-provider).

Here is a chat flow:

```diff
- First, fetch all chaintools for me.
+ AI uses `observeTools` action.
# ...
- Please get the details of the "Add" chaintool.
+ AI uses `observeToolAbis` action.
# ...
- Use this tool to add numbers 5 and 9 please.
+ AI uses `useTool` action.
```

Here is another

```diff
- Find all chaintools we have online.
+ AI uses `observeTools` action.
# ...
- Get details of "Tea Token" chaintool
+ AI uses `observeToolAbis` action.
# ...
- Tell me the Tea Token balance of address 0x5FbDB2315678afecb367f032d93F642f64180aa3
+ AI uses `useTool` action.
```
