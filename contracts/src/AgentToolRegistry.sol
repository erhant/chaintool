// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice This is a contract that will be used to register agents and tools.
contract AgentToolRegistry is Ownable {
    /// @notice Emitted when a tool is registered.
    event ToolRegistered(address indexed tool);

    /// @notice The tools that are registered.
    mapping(address => bool) public tools;

    /// @notice Register a tool.
    function registerTool(address tool) external {
        tools[tool] = true;
        emit ToolRegistered(tool);
    }

    constructor() Ownable(msg.sender) {}
}
