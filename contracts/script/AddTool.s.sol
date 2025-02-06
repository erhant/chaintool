// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {AgentToolRegistry} from "../src/AgentTools.sol";
import {AddTool} from "../src/tools/AddTool.sol";

// REGISTRY=0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0 forge script script/AddTool.s.sol:NewTool --rpc-url http://127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
contract NewTool is Script {
    function run() public {
        address registryAddress = vm.envAddress("REGISTRY");
        require(registryAddress != address(0), "Invalid registry address");

        vm.startBroadcast();

        // Create a new AddTool contract
        AddTool addTool = new AddTool(registryAddress);
        addTool.register();

        vm.stopBroadcast();
    }
}
