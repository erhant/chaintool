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

Setup everything for testing with `setup.sh`.
