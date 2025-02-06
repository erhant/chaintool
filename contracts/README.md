# Contracts

Install dependencies:

```sh
# overall setup
forge install

# for dependencies
bun install
```

Test contracts:

```sh
forge test
```

Export ABI to clipboard with `bun abi`, which does:

```sh
forge inspect AgentToolRegistry abi | pbcopy
```

Deploy to local network with:

```sh
# using Anvil key
forge create src/AgentTools.sol:AgentToolRegistry --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# will deploy to 0x5FbDB2315678afecb367f032d93F642f64180aa3 in first run
```

Run add tool script on local network with (for some registry address):

```sh
REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 forge script script/AddTool.s.sol:NewTool --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
