#!/bin/sh

# exit on first error
set -e

forge test

forge inspect AgentToolRegistry abi | pbcopy

forge create src/AgentTools.sol:AgentToolRegistry --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

REGISTRY=0x5FbDB2315678afecb367f032d93F642f64180aa3 forge script script/AddTool.s.sol:NewTool \
  --rpc-url http://127.0.0.1:8545 --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80