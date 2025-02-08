# Re-agent

An Agent that can create more agents like itself, based on [CDP](https://portal.cdp.coinbase.com/) and [AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome). The repo is based on [this example](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#starting-from-scratch-with-langchain) and [this doc](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#add-custom-functionality-using-ai-or-manually).

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
- First, fetch all on-chain tools for me.
+ AI uses `observeTools` action.
# ...
- Please get the details of the "ERC20" tool.
+ AI uses `observeToolAbis` action.
# ...
- Use the ERC20 tool to check the balance of address 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
+ AI uses `useTool` action.
```
