import { FC, useEffect, useState } from "react";
import abi from "../AgentToolRegistry.abi";
import { hexToString, publicActions, stringToHex } from "viem";
import { useClient } from "wagmi";
import {
  Button,
  Combobox,
  Group,
  Pill,
  PillsInput,
  Stack,
  Table,
  Text,
  useCombobox,
} from "@mantine/core";
import ViewTool from "./ViewTool";
import { ChaintoolType, CONTRACT_ADDRESS } from "../constants";

const ToolMenu: FC = () => {
  const client = useClient()?.extend(publicActions);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [categorySearch, setCategorySearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [tools, setTools] = useState<ChaintoolType[]>([]);
  const [toolIdx, setToolIdx] = useState<bigint | undefined>();

  const handleValueSelect = (val: string) =>
    setCategories((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setCategories((current) => current.filter((v) => v !== val));

  const values = categories.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = allCategories
    .filter((item) =>
      item.toLowerCase().includes(categorySearch.trim().toLowerCase())
    )
    .map((item) => (
      <Combobox.Option
        value={item}
        key={item}
        active={categories.includes(item)}
      >
        <Group gap="sm">
          {categories.includes(item) ? "✓" : null}
          <span>{item}</span>
        </Group>
      </Combobox.Option>
    ));

  // get all categories on first render
  useEffect(() => {
    if (client && allCategories.length === 0) {
      console.log("fetching all categories");
      client
        .readContract({
          address: CONTRACT_ADDRESS,
          abi,
          functionName: "getRegisteredCategories",
        })
        .then((bytes32categories) =>
          setAllCategories(
            bytes32categories.map((bc) => hexToString(bc, { size: 32 }))
          )
        );
    }
  }, [client, allCategories.length]);

  async function handleSearchClick() {
    if (!client) return;
    console.log("searching for tools with categories", categories);

    const bytes32categories = categories.map((c) =>
      stringToHex(c, { size: 32 })
    );
    setIsSearchLoading(true);

    // FIXME: old event based thing, gave 503 in Sepolia for some reason
    // const toolEventLogs = await client.getContractEvents({
    //   address: CONTRACT_ADDRESS,
    //   abi,
    //   eventName: "ToolRegistered",
    //   args: {
    //     category: bytes32categories.length === 0 ? null : bytes32categories,
    //   },
    //   fromBlock: 21635860n, // just before the contract was deployed on base-sepolia
    // });
    // const toolMetadata = toolEventLogs
    //   // filter out duplicates by index
    //   .filter(
    //     (log, i, self) =>
    //       self.findIndex((l) => l.args.idx === log.args.idx) === i
    //   )
    //   .map((log) => ({
    //     ...log.args,
    //     idx: BigInt(log.args.idx ?? 0),
    //     category: hexToString(log.args.category ?? "0x", { size: 32 }),
    //   }));
    // const toolDescriptions = await client.readContract({
    //   address: CONTRACT_ADDRESS,
    //   abi,
    //   functionName: "getDescriptions",
    //   args: [toolMetadata.map((tool) => tool.idx)],
    // });
    // const tools = toolMetadata.map((tool, i) => ({
    //   ...tool,
    //   description: toolDescriptions[i],
    // }));

    const toolWithDupes =
      bytes32categories.length === 0
        ? await client.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: "getAllTools",
          })
        : await client.readContract({
            address: CONTRACT_ADDRESS,
            abi,
            functionName: "getToolsByCategories",
            args: [bytes32categories],
          });
    const tools = toolWithDupes.filter(
      (tool, i, self) => self.findIndex((t) => t.idx === tool.idx) === i
    );

    setTools(tools as ChaintoolType[]); // to bypass readonly
    setIsSearchLoading(false);
  }

  return (
    <div>
      <Stack>
        <div>
          <Text mt="xs">
            Type the categories you want to search for, and click search to view
            the respective tools. You can click search right away without
            selecting any categories to view all tools!
          </Text>

          <Text mt="xs">
            When you find a tool you want to explore, click on its index to view
            its details and functions.
          </Text>
        </div>

        <Combobox
          store={combobox}
          onOptionSubmit={handleValueSelect}
          disabled={isSearchLoading}
        >
          <Combobox.DropdownTarget>
            <PillsInput
              onClick={() => combobox.openDropdown()}
              label="Chaintool Categories"
              description="Select categories to search respective Chaintools, leave empty to select all."
              rightSectionWidth="auto"
              rightSection={
                <Button
                  variant="filled"
                  onClick={handleSearchClick}
                  loading={isSearchLoading}
                  disabled={isSearchLoading}
                >
                  Search
                </Button>
              }
            >
              <Pill.Group>
                {values}

                <Combobox.EventsTarget>
                  <PillsInput.Field
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    value={categorySearch}
                    placeholder="Search values"
                    onChange={(event) => {
                      combobox.updateSelectedOptionIndex();
                      setCategorySearch(event.currentTarget.value);
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key === "Backspace" &&
                        categorySearch.length === 0
                      ) {
                        event.preventDefault();
                        handleValueRemove(categories[categories.length - 1]);
                      }
                    }}
                  />
                </Combobox.EventsTarget>
              </Pill.Group>
            </PillsInput>
          </Combobox.DropdownTarget>

          <Combobox.Dropdown>
            <Combobox.Options>
              {options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>No such category</Combobox.Empty>
              )}
            </Combobox.Options>
          </Combobox.Dropdown>
        </Combobox>
      </Stack>

      {/* show tools w.r.t category */}
      {tools.length === 0 ? (
        <></>
      ) : (
        <div>
          <Text size="xl" ta="center"></Text>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th />
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tools.map((tool) => (
                <Table.Tr key={tool.idx}>
                  <Table.Td>
                    <Button
                      size="compact-xs"
                      variant="default"
                      onClick={() => setToolIdx(tool.idx)}
                    >
                      {tool.idx}
                    </Button>
                  </Table.Td>
                  <Table.Td>
                    <a
                      href={`https://base-sepolia.blockscout.com/address/${tool.target}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {tool.name}
                    </a>
                  </Table.Td>
                  <Table.Td>{tool.desc}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}

      {/* view selected tool */}
      {toolIdx !== undefined ? (
        <>
          <ViewTool toolIdx={toolIdx} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ToolMenu;
