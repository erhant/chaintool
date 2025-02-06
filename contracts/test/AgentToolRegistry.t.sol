// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test, console2} from "forge-std/Test.sol";
import {AgentToolRegistry} from "../src/AgentToolRegistry.sol";
import {AddTool} from "../src/tools/AddTool.sol";
import {AgentTool} from "../src/AgentTool.sol";

contract AgentToolRegistryTest is Test {
    AgentToolRegistry public registry;

    function setUp() public {
        registry = new AgentToolRegistry();
        vm.label(address(registry), "AgentToolRegistry");
    }

    function test_OutOfBounds() public {
        vm.expectRevert(AgentToolRegistry.OutOfBounds.selector);
        registry.getTool(0);
    }

    function test_AddToolRegistration() public {
        // deploy add tool
        AddTool addTool = new AddTool(registry);
        vm.label(address(addTool), "AddTool");

        // registers itself; expect the event
        vm.expectEmit(address(registry));
        emit AgentToolRegistry.ToolRegistered(0, "Add", address(this), address(addTool));
        addTool.register();

        // get the registered tool
        AgentTool memory tool = registry.getTool(0);

        // verify tool details
        assertEq(tool.idx, 0);
        assertEq(tool.name, "Add");
        assertEq(tool.category, "math");
        assertEq(tool.target, address(addTool));
        assertEq(tool.owner, address(this));

        // test the actual addition functionality
        bytes memory data = abi.encodeWithSelector(addTool.add.selector, 5, 3);
        (bool success, bytes memory result) = tool.target.staticcall(data);

        require(success, "Add call failed");
        int256 sum = abi.decode(result, (int256));
        assertEq(sum, 8);
    }
}
