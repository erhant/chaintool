import { FC, useState } from "react";
import abi from "../AgentToolRegistry.abi";
import { hexToString, stringToHex } from "viem";
import { usePublicClient } from "wagmi";
import { Button, Stack, Table, Text, TextInput } from "@mantine/core";
import ViewTool from "./ViewTool";
import { CONTRACT_ADDRESS, type Chaintool } from "../constants";

const ToolMenu: FC = () => {
  // const { address } = useAccount();
  const publicClient = usePublicClient();
  const [categories, setCategories] = useState<string[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [tools, setTools] = useState<Chaintool[]>([]);
  const [toolIdx, setToolIdx] = useState<bigint | undefined>();

  async function handleSearchClick() {
    if (!publicClient) return;
    console.log("searching for tools with categories", categories);

    const bytes32categories = categories.map((c) =>
      stringToHex(c, { size: 32 })
    );
    setIsSearchLoading(true);
    const toolEventLogs = await publicClient.getContractEvents({
      address: CONTRACT_ADDRESS,
      abi,
      eventName: "ToolRegistered",
      args: {
        category: bytes32categories.length === 0 ? null : bytes32categories,
      },
      fromBlock: 21635860n, // just before the contract was deployed on base-sepolia
    });

    const toolMetadata = toolEventLogs
      // filter out duplicates by index
      .filter(
        (log, i, self) =>
          self.findIndex((l) => l.args.idx === log.args.idx) === i
      )
      .map((log) => ({
        ...log.args,
        idx: BigInt(log.args.idx ?? 0),
        category: hexToString(log.args.category ?? "0x", { size: 32 }),
      }));

    // read descriptions for each tool
    const toolDescriptions = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "getDescriptions",
      args: [toolMetadata.map((tool) => tool.idx)],
    });

    // zip metadata with descriptions
    const tools = toolMetadata.map((tool, i) => ({
      ...tool,
      description: toolDescriptions[i],
    }));

    setIsSearchLoading(false);
    setTools(tools);
  }

  return (
    <div>
      <Stack>
        <Text size="xl">View Chaintools</Text>
        <TextInput
          label="Chaintool Categories"
          description="Enter categories to search, comma separated. (e.g. defi,erc20,misc)"
          placeholder="defi, erc20, misc"
          value={categories.join(", ")}
          onChange={(event) =>
            setCategories(
              event.currentTarget.value
                .split(", ")
                .map((s) => s.trim())
                .filter((s) => s !== "")
            )
          }
          disabled={isSearchLoading}
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
        />
      </Stack>

      {/* show tools w.r.t category */}
      {tools.length === 0 ? (
        <Text size="xl" ta="center">
          No tools selected
        </Text>
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
                  <Table.Td>{tool.description}</Table.Td>
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
