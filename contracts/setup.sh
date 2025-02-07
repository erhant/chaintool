#!/bin/sh

# exit on first error
set -e

forge build

forge test -vv

forge inspect AgentToolRegistry abi | pbcopy

forge create src/AgentTools.sol:AgentToolRegistry --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 forge script script/Tools.s.sol:NewAddTool \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 TOKEN=0x4200000000000000000000000000000000000006 forge script script/Tools.s.sol:NewERC20Tool \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80