// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {AgentToolRegistry} from "../src/AgentTools.sol";

/// @dev Alternatively, use:
///
/// ```sh
/// forge create src/AgentTools.sol:AgentToolRegistry --broadcast --private-key $PRIVATE_KEY
/// ```
contract DeployAgentToolRegistry is Script {
    AgentToolRegistry public registry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        registry = new AgentToolRegistry();

        vm.stopBroadcast();
    }
}
