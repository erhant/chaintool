// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {AgentToolRegistry} from "../AgentTools.sol";

/// @notice An ERC20 tool that captures all ERC20 actions as a single on-chain tool.
contract ERC20Tool {
    AgentToolRegistry immutable registry;
    address immutable token;

    constructor(address _registry, address _token) {
        registry = AgentToolRegistry(_registry);
        token = _token;
    }

    function register() external {
        string[] memory abis = new string[](5);
        abis[0] = "function balanceOf(address _owner) external view returns (uint256 balance)";
        abis[1] = "function transfer(address _to, uint256 _value) external returns (bool success)";
        abis[2] = "function transferFrom(address _from, address _to, uint256 _value) external returns (bool success)";
        abis[3] = "function approve(address _spender, uint256 _value) external returns (bool success)";
        abis[4] = "function allowance(address _owner, address _spender) external view returns (uint256 remaining)";

        bytes32[] memory categories = new bytes32[](2);
        categories[0] = "defi";
        categories[1] = "erc20";
        registry.register("ERC20", "Exposes all ERC20 interface actions.", abis, categories, token, msg.sender);
    }
}
