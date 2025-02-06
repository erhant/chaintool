// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {AgentTool, AgentToolRegistry} from "../src/AgentTools.sol";
import {AddTool} from "../src/tools/AddTool.sol";

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
        AddTool addTool = new AddTool(address(registry));
        vm.label(address(addTool), "AddTool");

        // registers itself; expect the event
        vm.expectEmit(address(registry));
        emit AgentToolRegistry.ToolRegistered(0, "Add", address(addTool), address(this), "math");
        addTool.register();

        // get the registered tool
        AgentTool memory tool = registry.getTool(0);

        // verify tool details
        assertEq(tool.idx, 0);
        assertEq(tool.name, "Add");
        assertEq(tool.categories[0], "math");
        assertEq(tool.target, address(addTool));
        assertEq(tool.owner, address(this));

        // test the actual addition functionality
        bytes memory data = abi.encodeWithSelector(addTool.add.selector, 5, 3);
        (bool success, bytes memory result) = tool.target.staticcall(data);

        require(success, "Add call failed");
        int256 sum = abi.decode(result, (int256));
        assertEq(sum, 8);
    }

    function test_GetDescriptions() public {
        // deploy add tool
        AddTool addTool = new AddTool(address(registry));
        vm.label(address(addTool), "AddTool");

        // register two times
        addTool.register();
        addTool.register();

        // get the description
        uint256[] memory indexes = new uint256[](2);
        indexes[0] = 0;
        indexes[1] = 1;
        string[] memory descs = registry.getDescriptions(indexes);
        assertEq(descs.length, 2);
        // TODO: !!!
        // assertEq(keccak256(abi.encodePacked(descs[0])), keccak256(abi.encodePacked(addTool.desc)));
        // assertEq(keccak256(abi.encodePacked(descs[1])), keccak256(abi.encodePacked(addTool.desc)));
    }
}
