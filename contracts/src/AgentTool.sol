// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

/// @notice A tool description that can be used by agents.
abstract contract AgentTool {
    /// @notice Emitted when a tool is called.
    event ToolCalled(address indexed agent, address indexed tool);

    /// @notice The name of the action.
    /// This is used to identify the action when it is added to an Agent.
    string public name;

    /// @notice A description that helps the AI understand when and how to use the action.
    /// It's important to describe the inputs and outputs of the action and include examples.
    /// Additionally, think about what inputs can be removed entirely and fetched or inferred by the LLM, so that users don't have to manually provide them.
    string public description;

    /// @notice A human-readable ABI type string that describes the ABI of the action.
    /// @dev See: https://abitype.dev/api/human
    /// @dev Example: `function balanceOf(address owner) view returns (uint256)`
    string public abitype;
}
