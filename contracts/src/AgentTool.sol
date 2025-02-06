// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

/// @notice A tool description that can be used by agents.
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
    /// @notice Tool category. This is expected to be a string that is used to group tools together.
    string category;
    /// @notice The address of the target contract that the action will be called on.
    /// @dev This may not be unique, as multiple tools may target the same contract.
    address target;
    /// @notice The address that registered the tool.
    address owner;
}
