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

    function test_FailOnNonFunctionAbi() public {
        string[] memory abis = new string[](1);
        abis[0] = "event Yeahbaby(address who)";
        bytes32[] memory categories = new bytes32[](1);
        categories[0] = "math";

        // registers itself; expect the event
        vm.expectRevert(AgentToolRegistry.InvalidAbiType.selector);
        registry.register("Fail", "Should fail.", abis, categories, address(this), msg.sender);
    }

    function test_FailOnMissingAbi() public {
        string[] memory abis = new string[](0);
        bytes32[] memory categories = new bytes32[](1);
        categories[0] = "math";

        // registers itself; expect the event
        vm.expectRevert(AgentToolRegistry.MissingAbiTypes.selector);
        registry.register("Fail", "Should fail.", abis, categories, address(this), msg.sender);
    }

    function test_FailOnMissingCategory() public {
        string[] memory abis = new string[](1);
        abis[0] = "function add(int256 a, int256 b) pure returns (int256)";
        bytes32[] memory categories = new bytes32[](0);

        // registers itself; expect the event
        vm.expectRevert(AgentToolRegistry.MissingCategories.selector);
        registry.register("Fail", "Should fail.", abis, categories, address(this), msg.sender);
    }
}
