// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {AgentToolRegistry} from "../src/AgentTools.sol";

import {AddTool} from "../src/tools/AddTool.sol";
import {ERC20Tool} from "../src/tools/ERC20Tool.sol";

contract NewAddTool is Script {
    function run() public {
        address registryAddress = vm.envAddress("REGISTRY");
        require(registryAddress != address(0), "Invalid registry address");

        vm.startBroadcast();

        AddTool addTool = new AddTool(registryAddress);
        addTool.register();

        vm.stopBroadcast();
    }
}

contract NewERC20Tool is Script {
    function run() public {
        address registryAddress = vm.envAddress("REGISTRY");
        address tokenAddress = vm.envAddress("TOKEN");
        require(registryAddress != address(0), "Invalid registry address");
        require(tokenAddress != address(0), "Invalid token address");

        vm.startBroadcast();

        ERC20Tool erc20Tool = new ERC20Tool(registryAddress, tokenAddress);
        erc20Tool.register();

        vm.stopBroadcast();
    }
}
