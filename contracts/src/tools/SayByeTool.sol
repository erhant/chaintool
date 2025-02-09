// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AgentToolRegistry} from "../AgentTools.sol";

contract SayByeTool {
    AgentToolRegistry immutable registry;

    mapping(address agent => uint256 numberOfByes) public numAgentSaidBye;

    constructor(address _registry) {
        registry = AgentToolRegistry(_registry);
    }

    /// @dev Registers the tool with the AgentToolRegistry.
    function register() external {
        string[] memory abis = new string[](2);
        abis[0] = "function sayBye() external";
        // getter for the public state variable
        abis[1] = "function numAgentSaidBye(address agent) view returns (uint256 numberOfByes)";

        bytes32[] memory categories = new bytes32[](1);
        categories[0] = "misc";

        registry.register(
            "Say Bye",
            "Just a contract that where can call `sayBye` to say bye, more than once!",
            abis,
            categories,
            address(this),
            msg.sender
        );
    }

    function sayBye() external {
        numAgentSaidBye[msg.sender] += 1;
    }
}
