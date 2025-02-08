// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AgentToolRegistry} from "../AgentTools.sol";

/// @notice A tool that adds two numbers together and returns their sum.
/// @dev This is an example of a contract that can be registered as a tool.
contract AddTool {
    AgentToolRegistry immutable registry;

    constructor(address _registry) {
        registry = AgentToolRegistry(_registry);
    }

    /// @dev Registers the tool with the AgentToolRegistry.
    function register() external {
        string[] memory abis = new string[](1);
        abis[0] = "function add(int256 a, int256 b) pure returns (int256)";

        bytes32[] memory categories = new bytes32[](1);
        categories[0] = "math";

        registry.register(
            "Add", "Adds two numbers together and returns their sum.", abis, categories, address(this), msg.sender
        );
    }

    function add(int256 a, int256 b) external pure returns (int256 sum) {
        sum = a + b;
    }
}
