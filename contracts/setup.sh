#!/bin/sh

# exit on first error
set -e

###############################################################################

# build stuff from scratch
forge build --force

# test stuff
forge test -vv

# export abi
forge inspect AgentToolRegistry abi > AgentToolRegistry.abi.json

###############################################################################

# create registry
forge create src/AgentTools.sol:AgentToolRegistry --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# fund your agent
cast send 0x4bF825602483D9D4f8f46CC0cc2d02272BD4909C --value 1ether \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# register AddTool
REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 \
forge script script/Tools.s.sol:NewAddTool \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# register ERC20 (Tea Token in Base Sepolia)
REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 TOKEN=0x87C51CD469A0E1E2aF0e0e597fD88D9Ae4BaA967 TOKEN_NAME="Tea Token" \
forge script script/Tools.s.sol:NewERC20Tool \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# register WETH
REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 \
forge script script/Tools.s.sol:NewWETHTool \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80