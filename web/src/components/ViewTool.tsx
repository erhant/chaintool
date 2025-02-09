import { useEffect, useState } from "react";
import { ChaintoolType, CONTRACT_ADDRESS } from "../constants";
import { Badge, Card, Code, Group, Stack, Text, Title } from "@mantine/core";
import { config } from "../wagmi.config";
import { readContract } from "wagmi/actions";
import abi from "../AgentToolRegistry.abi";
import { hexToString } from "viem";

const ViewTool: React.FC<{
  toolIdx: bigint;
}> = ({ toolIdx }) => {
  const [tool, setTool] = useState<ChaintoolType | undefined>();

  useEffect(() => {
    const getTool = async () => {
      const tool = await readContract(config, {
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "getTool",
        args: [toolIdx],
      });

      setTool(tool as ChaintoolType);
    };
    getTool();
  }, [toolIdx]);

  if (!tool) return <Text>Loading...</Text>;
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mt="lg">
      <Group mt="md" mb="xs">
        <Badge color="pink">{tool.idx}</Badge>
        <Title order={2}>{tool.name}</Title>
      </Group>

      {/* description */}
      <Text size="sm" c="dimmed">
        {tool.desc}
      </Text>

      {/* catgeories */}
      <Group mt="sm" mb="sm" gap="xs">
        {tool.categories.map((category, i) => (
          <Badge key={i} color="orange">
            {hexToString(category, { size: 32 })}
          </Badge>
        ))}
      </Group>

      {/* functions abitypes */}
      <Title order={5} c="dimmed">
        Functions
      </Title>
      <Stack mt="sm" gap="xs">
        {tool.abitypes.map((abi, i) => (
          <Code key={i} c="dimmed">
            {abi}
          </Code>
        ))}
      </Stack>

      {/* TODO: show categories */}
      {/* <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button> */}
    </Card>
  );
};

export default ViewTool;
