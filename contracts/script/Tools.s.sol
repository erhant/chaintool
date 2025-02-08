// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Script} from "forge-std/Script.sol";
import {AgentToolRegistry} from "../src/AgentTools.sol";

import {AddTool} from "../src/tools/AddTool.sol";

contract NewAddTool is Script {
    function run() public {
        address registryAddress = vm.envAddress("REGISTRY");
        require(registryAddress != address(0), "Invalid registry address");

        vm.startBroadcast();

        AddTool addTool = new AddTool(registryAddress);
        addTool.register();

        vm.stopBroadcast();
    }
}

/// @dev Registers a given token address as ERC20 token.
contract NewERC20Tool is Script {
    function run() public {
        address registryAddress = vm.envAddress("REGISTRY");
        require(registryAddress != address(0), "Invalid registry address");
        address tokenAddress = vm.envAddress("TOKEN");
        require(tokenAddress != address(0), "Invalid token address");
        string memory tokenName = vm.envString("TOKEN_NAME");
        require(bytes(tokenName).length > 0, "Invalid token name");

        vm.startBroadcast();

        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.5/contracts/token/ERC20/IERC20.sol
        string[] memory abis = new string[](5);
        abis[0] = "function balanceOf(address _owner) external view returns (uint256 balance)";
        abis[1] = "function transfer(address _to, uint256 _value) external returns (bool success)";
        abis[2] = "function transferFrom(address _from, address _to, uint256 _value) external returns (bool success)";
        abis[3] = "function approve(address _spender, uint256 _value) external returns (bool success)";
        abis[4] = "function allowance(address _owner, address _spender) external view returns (uint256 remaining)";

        bytes32[] memory categories = new bytes32[](2);
        categories[0] = "defi";
        categories[1] = "erc20";

        AgentToolRegistry(registryAddress).register(
            tokenName,
            "Exposes all ERC20 interface actions for the target token.",
            abis,
            categories,
            tokenAddress,
            msg.sender
        );

        vm.stopBroadcast();
    }
}

/// @dev Registers WETH contract at 0x4200000000000000000000000000000000000006
contract NewWETHTool is Script {
    function run() public {
        address registryAddress = vm.envAddress("REGISTRY");
        require(registryAddress != address(0), "Invalid registry address");

        vm.startBroadcast();

        // https://base-sepolia.blockscout.com/token/0x4200000000000000000000000000000000000006?tab=contract
        string[] memory abis = new string[](8);
        abis[0] = "function balanceOf(address owner) external view returns (uint256 balance)";
        abis[1] = "function transfer(address dst, uint256 wad) external returns (bool success)";
        abis[2] = "function transferFrom(address src, address dst, uint256 wad) external returns (bool success)";
        abis[3] = "function approve(address guy, uint256 wad) external returns (bool success)";
        abis[4] = "function allowance(address owner, address spender) external view returns (uint256 remaining)";
        abis[5] = "function deposit() public payable";
        abis[6] = "function withdraw(uint wad) public";
        abis[7] = "function totalSupply() public view returns (uint supply)";

        bytes32[] memory categories = new bytes32[](3);
        categories[0] = "defi";
        categories[1] = "erc20";
        categories[2] = "weth";

        AgentToolRegistry(registryAddress).register(
            "WETH",
            "Exposes WETH contract functionality, including deposit and withdraw.",
            abis,
            categories,
            0x4200000000000000000000000000000000000006,
            msg.sender
        );

        vm.stopBroadcast();
    }
}
