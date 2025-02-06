// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {AgentToolRegistry} from "../src/AgentTools.sol";

contract DeployAgentToolRegistry is Script {
    AgentToolRegistry public registry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        registry = new AgentToolRegistry();

        vm.stopBroadcast();
    }
}
