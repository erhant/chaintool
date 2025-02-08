// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AgentToolRegistry} from "../AgentTools.sol";

/// @notice A tool that allows agents to let us know that they are here!
contract SayHiTool {
    AgentToolRegistry immutable registry;

    error AlreadySaidHi();

    mapping(address agent => bool hasSaidHi) public hasAgentSaidHi;

    constructor(address _registry) {
        registry = AgentToolRegistry(_registry);
    }

    /// @dev Registers the tool with the AgentToolRegistry.
    function register() external {
        string[] memory abis = new string[](2);
        abis[0] = "function sayHi() external";
        // getter for the public state variable
        abis[1] = "function hasAgentSaidHi(address agent) view returns (bool)";

        bytes32[] memory categories = new bytes32[](1);
        categories[0] = "misc";

        registry.register(
            "Say Hi",
            "Just a contract that where can call `sayHi` to say hi!",
            abis,
            categories,
            address(this),
            msg.sender
        );
    }

    /// @notice Just call this to say hi :)
    /// @dev This function will revert if the agent has already said hi.
    function sayHi() external {
        require(!hasAgentSaidHi[msg.sender], AlreadySaidHi());
        hasAgentSaidHi[msg.sender] = true;
    }
}
