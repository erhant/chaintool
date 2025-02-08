# Chaintool: SDK

This folder contains the main AgentKit logic & actions.

## Installation

Clone the repository:

```sh
git clone https://github.com/erhant/chaintools
cd chaintools/sdk
```

We used Bun for this project.

```sh
bun install
```

## Setup

To begin setup, copy `.env.example` as `.env`:

```sh
cp .env.example .env
```

The project uses [CDP](https://portal.cdp.coinbase.com/), so you should first go there and create an API Key. Then, edit the two keys in `.env` accordingly:

- `CDP_API_KEY_NAME`
- `CDP_API_KEY_PRIVATE_KEY`

Our agent will use OpenAI as its model provider, so you should go and create an OpenAI API key as well. WHen you are done, set the following key in `.env`:

- `OPENAI_API_KEY`

That's all!

## Usage

Start the project with:

```sh
bun run ./src/index.ts
```

On the first launch, a [Hierarchical Deterministic (HD)](https://viem.sh/docs/accounts/local/hdKeyToAccount) wallet will be exported at `./secrets/cdp_mpc_wallet_data.json` from your CDP Wallet provider, and the later runs will keep using that wallet. The `seed` of this exported wallet is used to create a wallet client via `HDKey.fromMasterSeed` as well for Viem.

You will see the agent & registry address on the terminal, and be greeted with two options:

- `chat`: chat with your agent step by step.
- `auto`: let your agent loose on the blockchain!

### Funding your Agent

Make sure you fund this address before moving on with making transactions. You can either do this via another wallet, or you can request funds from a provided tool. Here is an example in Chat mode:

```diff
- Get some funds from the faucet for your address.
+ I have successfully requested ETH from the faucet for my wallet on the Base Sepolia network. You can view the transaction [here](https://sepolia.basescan.org/tx/0xa407b49fc9cf92b63d8d068b63786f382d20a7ac53c83e8cfc804e51118b61a0).
```

### Using Chaintools

You can try to see all Chaintools with a prompt like:

```diff
- Show me all the chaintools available.
+ Here are all the available Chaintools:
+
+ 1. **Add**: Adds two numbers together and returns their sum.
+ 2. **Tea Token**: Exposes all ERC20 interface actions for the target token.
+ 3. **WETH**: Exposes WETH contract functionality, including deposit and withdraw.
+ 4. **Say Hi**: A contract where you can call `sayHi` to say hi!
```

You can ask the details of a tool by providing its name:

```diff
- Show me the details of "Say Hi" chaintool.
+ The "Say Hi" Chaintool at address `0x38A9D6d89b7515159732086155166Bd089E138BD` has the following functions:
+
+ - `sayHi()`: A function to say hi.
+ - `hasAgentSaidHi(address agent)`: A view function that returns a boolean indicating whether a specified agent has said hi.
```

Now, the agent knows what this tool does so you can use it like:

```diff
- Tell me if address 0x0000Bb8c7B69d6c1a8D6A58A3c3B1757A37C08ce has said hi.
+ The address `0x0000Bb8c7B69d6c1a8D6A58A3c3B1757A37C08ce` has not said hi yet.
```

This was a "read" example, but the agent can do transactions as well. Here, we ask it to approve some tokens to some address:

```diff
- Show me the details of "WETH" chaintool.
+ The "WETH" Chaintool at address `0x4200000000000000000000000000000000000006` has the following functions:
+
+ - `balanceOf(address owner)`: Returns the WETH balance of a specified address.
+ - `transfer(address dst, uint256 wad)`: Transfers WETH to another address.
+ - `transferFrom(address src, address dst, uint256 wad)`: Transfers WETH from one address to another with allowance.
+ - `approve(address guy, uint256 wad)`: Approves another address to spend a specified amount of WETH.
+ - `allowance(address owner, address spender)`: Returns the remaining amount of WETH that a spender is allowed to spend from the owner's balance.
+ - `deposit()`: Allows depositing ETH to receive WETH.
+ - `withdraw(uint wad)`: Withdraws ETH by burning a specified amount of WETH.
+ - `totalSupply()`: Returns the total supply of WETH.

- Approve the address 0x0000Bb8c7B69d6c1a8D6A58A3c3B1757A37C08ce to spend 0.1 ether on your behalf using WETH chaintool.
+ I have successfully approved the address `0x0000Bb8c7B69d6c1a8D6A58A3c3B1757A37C08ce` to spend 0.1 WETH on your behalf. You can view the transaction [here](https://sepolia.basescan.org/tx/0x48aefdeb17be44d08853be559c55d270839755e7a2f67dff2e7dee8e63155965).
```

As we can see, the transaction is approved!
