// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AgentToolRegistry} from "../AgentToolRegistry.sol";

/// @notice A tool that adds two numbers together and returns their sum.
contract AddTool {
    AgentToolRegistry immutable registry;

    constructor(AgentToolRegistry _registry) {
        registry = _registry;
    }

    function register() external {
        string[] memory abis = new string[](1);
        abis[0] = "function add(int256 a, int256 b) pure returns (int256)";

        registry.register(
            "Add", "Adds two numbers together and returns their sum.", abis, "math", address(this), msg.sender
        );
    }

    function add(int256 a, int256 b) external pure returns (int256 sum) {
        sum = a + b;
    }
}
