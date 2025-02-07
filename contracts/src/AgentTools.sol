// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @notice A tool description that can be used by agents.
/// @author erhant
struct AgentTool {
    /// @notice Tool index.
    uint256 idx;
    /// @notice The name of the action.
    /// This is used to identify the action when it is added to an Agent.
    string name;
    /// @notice A description that helps the AI understand when and how to use the action.
    /// It's important to describe the inputs and outputs of the action and include examples.
    /// Additionally, think about what inputs can be removed entirely and fetched or inferred by the LLM, so that users don't have to manually provide them.
    string desc;
    /// @notice An array of human-readable ABI type strings that describe the ABIs of the action.
    /// @dev See: https://abitype.dev/api/human
    /// @dev Example: `function balanceOf(address owner) view returns (uint256)`
    string[] abitypes;
    /// @notice Tool categories.
    /// @dev This is expected to be a string that is used to group tools together.
    bytes32[] categories;
    /// @notice The address of the target contract that the action will be called on.
    /// @dev This may not be unique, as multiple tools may target the same contract.
    address target;
    /// @notice The address that registered the tool.
    address owner;
}

/// @notice This is a contract that will be used to register agents and tools.
/// @author erhant
contract AgentToolRegistry is Ownable {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    /// @notice Error emitted when an index is out of bounds.
    error OutOfBounds();
    /// @notice Error emitted when the ABI types are missing.
    error MissingAbiTypes();
    /// @notice Error emitted when the categories are missing.
    error MissingCategories();
    /// @notice Error emitted when an invalid ABI type is provided.
    error InvalidAbiType();

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /// @notice Emitted when a tool is registered.
    event ToolRegistered(uint256 idx, string name, address target, address indexed owner, bytes32 indexed category);

    /*//////////////////////////////////////////////////////////////
                                 STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice The tools that are registered.
    AgentTool[] tools;

    /// @notice A mapping of tool indexes by category.
    mapping(bytes32 category => uint256[]) public toolIdxsByCategory;

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

    /// @notice Returns the descriptions of the tools at the given indexes.
    function getDescriptions(uint256[] calldata indexes) external view returns (string[] memory) {
        string[] memory descs = new string[](indexes.length);
        for (uint256 i = 0; i < indexes.length; i++) {
            uint256 idx = indexes[i];
            if (idx >= tools.length) {
                revert OutOfBounds();
            }
            descs[i] = tools[idx].desc;
        }
        return descs;
    }

    /// @notice Register a tool.
    /// @param name The name of the tool.
    /// @param desc A description of the tool.
    /// @param abitypes An array of human-readable ABI type strings that describe the ABIs of the action.
    /// @param categories The categories of the tool.
    /// @param target The address of the target contract that the action will be called on.
    /// @param owner The address that registered the tool.
    /// @return idx The index of the tool.
    function register(
        string memory name,
        string memory desc,
        string[] memory abitypes,
        bytes32[] memory categories,
        address target,
        address owner
    ) external returns (uint256 idx) {
        idx = tools.length;

        // all abi-types must start with "function"
        require(abitypes.length > 0, MissingAbiTypes());
        for (uint256 i = 0; i < abitypes.length; i++) {
            require(bytes(abitypes[i]).length >= 8, InvalidAbiType());
            require(bytes(abitypes[i])[0] == bytes("function")[0], InvalidAbiType());
        }

        // require categories
        require(categories.length > 0, MissingCategories());

        AgentTool memory tool = AgentTool({
            idx: idx,
            name: name,
            desc: desc,
            abitypes: abitypes,
            categories: categories,
            target: target,
            owner: owner
        });
        tools.push(tool);

        // emit events for each category
        for (uint256 i = 0; i < categories.length; i++) {
            emit ToolRegistered(idx, name, target, owner, categories[i]);
        }
    }
}
