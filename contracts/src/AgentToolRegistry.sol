// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AgentTool} from "./AgentTool.sol";

/// @notice This is a contract that will be used to register agents and tools.
contract AgentToolRegistry is Ownable {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error OutOfBounds();

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a tool is registered.
    event ToolRegistered(uint256 idx, string indexed name, address indexed owner, address indexed target);

    /*//////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice The tools that are registered.
    AgentTool[] tools;

    /*//////////////////////////////////////////////////////////////
                                  LOGIC
    //////////////////////////////////////////////////////////////*/

    constructor() Ownable(msg.sender) {}

    /// @notice Returns the tool at the given index.
    /// @param index The index of the tool.
    /// @return tool The tool at the given index.
    function getTool(uint256 index) external view returns (AgentTool memory) {
        if (index >= tools.length) {
            revert OutOfBounds();
        }
        return tools[index];
    }

    /// @notice Register a tool.
    /// @param name The name of the tool.
    /// @param desc A description of the tool.
    /// @param abitypes An array of human-readable ABI type strings that describe the ABIs of the action.
    /// @param category The category of the tool.
    /// @param target The address of the target contract that the action will be called on.
    /// @param owner The address that registered the tool.
    /// @return idx The index of the tool.
    function register(
        string memory name,
        string memory desc,
        string[] memory abitypes,
        string memory category,
        address target,
        address owner
    ) external returns (uint256 idx) {
        idx = tools.length;

        AgentTool memory tool = AgentTool({
            idx: idx,
            name: name,
            desc: desc,
            abitypes: abitypes,
            category: category,
            target: target,
            owner: owner
        });
        tools.push(tool);

        // emit event
        emit ToolRegistered(tool.idx, tool.name, tool.owner, tool.target);
    }
}
