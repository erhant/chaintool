# Re-agent

An Agent that can create more agents like itself, based on [CDP](https://portal.cdp.coinbase.com/) and [AgentKit](https://docs.cdp.coinbase.com/agentkit/docs/welcome). The repo is based on [this example](https://docs.cdp.coinbase.com/agentkit/docs/quickstart#starting-from-scratch-with-langchain) and [this doc](https://docs.cdp.coinbase.com/agentkit/docs/add-agent-capabilities#add-custom-functionality-using-ai-or-manually).

## On-Chain Tool Calling

AgentKit supports tools within the code. This project aims to improve upon this by providing a tool-calling mechanism that is fed on-chain! This on-chain tool will be parsed by a single custom [action](https://github.com/coinbase/agentkit/blob/master/CONTRIBUTING-TYPESCRIPT.md#adding-an-action-provider).
