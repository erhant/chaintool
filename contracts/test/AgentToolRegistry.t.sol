// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {Test} from "forge-std/Test.sol";
import {AgentTool, AgentToolRegistry} from "../src/AgentTools.sol";
import {AddTool} from "../src/tools/AddTool.sol";
import {SayByeTool} from "../src/tools/SayByeTool.sol";

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

    function testGetToolsByCategory() public {
        // Register tools in different categories
        bytes32 category1 = bytes32("category1");
        bytes32 category2 = bytes32("category2");

        string[] memory abitypes = new string[](1);
        abitypes[0] = "function test()";

        bytes32[] memory categories1 = new bytes32[](1);
        categories1[0] = category1;

        bytes32[] memory categories2 = new bytes32[](1);
        categories2[0] = category2;

        registry.register("Tool1", "Desc1", abitypes, categories1, address(1), address(this));
        registry.register("Tool2", "Desc2", abitypes, categories1, address(2), address(this));
        registry.register("Tool3", "Desc3", abitypes, categories2, address(3), address(this));

        // Test getting tools by category1
        AgentTool[] memory toolsInCat1 = registry.getToolsByCategory(category1);
        assertEq(toolsInCat1.length, 2);
        assertEq(toolsInCat1[0].name, "Tool1");
        assertEq(toolsInCat1[1].name, "Tool2");

        // Test getting tools by category2
        AgentTool[] memory toolsInCat2 = registry.getToolsByCategory(category2);
        assertEq(toolsInCat2.length, 1);
        assertEq(toolsInCat2[0].name, "Tool3");

        // Test getting tools by non-existent category
        AgentTool[] memory emptyTools = registry.getToolsByCategory(bytes32("nonexistent"));
        assertEq(emptyTools.length, 0);
    }

    function testGetToolsByCategories() public {
        // Register tools with multiple categories
        bytes32 category1 = bytes32("category1");
        bytes32 category2 = bytes32("category2");

        string[] memory abitypes = new string[](1);
        abitypes[0] = "function test()";

        bytes32[] memory categoriesBoth = new bytes32[](2);
        categoriesBoth[0] = category1;
        categoriesBoth[1] = category2;

        registry.register("Tool1", "Desc1", abitypes, categoriesBoth, address(1), address(this));

        bytes32[] memory categories1 = new bytes32[](1);
        categories1[0] = category1;
        registry.register("Tool2", "Desc2", abitypes, categories1, address(2), address(this));

        // Test getting tools by multiple categories
        bytes32[] memory queryCategories = new bytes32[](2);
        queryCategories[0] = category1;
        queryCategories[1] = category2;

        AgentTool[] memory tools = registry.getToolsByCategories(queryCategories);
        assertEq(tools.length, 3); // Tool1 appears in both categories, Tool2 in category1
        assertEq(tools[0].name, "Tool1");
        assertEq(tools[1].name, "Tool2");
        assertEq(tools[2].name, "Tool1");
    }

    function testGetRegisteredCategories() public {
        // Initial state should have no categories
        bytes32[] memory initialCategories = registry.getRegisteredCategories();
        assertEq(initialCategories.length, 0);

        // Register tools with different categories
        bytes32 category1 = bytes32("category1");
        bytes32 category2 = bytes32("category2");

        string[] memory abitypes = new string[](1);
        abitypes[0] = "function test()";

        bytes32[] memory categories1 = new bytes32[](1);
        categories1[0] = category1;

        bytes32[] memory categories2 = new bytes32[](1);
        categories2[0] = category2;

        // Register first tool
        registry.register("Tool1", "Desc1", abitypes, categories1, address(1), address(this));
        bytes32[] memory categoriesAfterFirst = registry.getRegisteredCategories();
        assertEq(categoriesAfterFirst.length, 1);
        assertEq(categoriesAfterFirst[0], category1);

        // Register second tool with different category
        registry.register("Tool2", "Desc2", abitypes, categories2, address(2), address(this));
        bytes32[] memory categoriesAfterSecond = registry.getRegisteredCategories();
        assertEq(categoriesAfterSecond.length, 2);
        assertEq(categoriesAfterSecond[0], category1);
        assertEq(categoriesAfterSecond[1], category2);

        // Register third tool with existing category (shouldn't add new category)
        registry.register("Tool3", "Desc3", abitypes, categories1, address(3), address(this));
        bytes32[] memory categoriesAfterThird = registry.getRegisteredCategories();
        assertEq(categoriesAfterThird.length, 2);
    }

    function test_SayByeTool() public {
        // deploy say bye tool
        SayByeTool sayByeTool = new SayByeTool(address(registry));
        vm.label(address(sayByeTool), "SayByeTool");

        // registers itself; expect the event
        vm.expectEmit(address(registry));
        emit AgentToolRegistry.ToolRegistered(0, "Say Bye", address(sayByeTool), address(this), "misc");
        sayByeTool.register();

        // get the registered tool
        AgentTool memory tool = registry.getTool(0);

        // verify tool details
        assertEq(tool.idx, 0);
        assertEq(tool.name, "Say Bye");
        assertEq(tool.categories[0], "misc");
        assertEq(tool.target, address(sayByeTool));
        assertEq(tool.owner, address(this));

        // test the sayBye functionality
        assertEq(sayByeTool.numAgentSaidBye(address(this)), 0);
        sayByeTool.sayBye();
        assertEq(sayByeTool.numAgentSaidBye(address(this)), 1);
        sayByeTool.sayBye();
        assertEq(sayByeTool.numAgentSaidBye(address(this)), 2);
    }
}
