// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AgentTool} from "../AgentTool.sol";

/// @notice A tool that adds two numbers together and returns their sum.
contract AddTool is AgentTool {
    constructor() {
        name = "Add";
        description = "Adds two numbers together and returns their sum.";
        abitype = "function add(int256 a, int256 b) pure returns (int256)";
    }

    function add(int256 a, int256 b) external pure returns (int256 sum) {
        sum = a + b;

        emit ToolCalled(msg.sender, address(this));
    }
}
