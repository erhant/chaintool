import { useEffect, useState } from "react";
import { ChaintoolDetailed, CONTRACT_ADDRESS } from "../constants";
import { Badge, Card, Code, Group, Stack, Text, Title } from "@mantine/core";
import { config } from "../wagmi.config";
import { readContract } from "wagmi/actions";
import abi from "../AgentToolRegistry.abi";

const ViewTool: React.FC<{
  toolIdx: bigint;
}> = ({ toolIdx }) => {
  const [tool, setTool] = useState<ChaintoolDetailed | undefined>();

  useEffect(() => {
    const getTool = async () => {
      const tool = await readContract(config, {
        abi,
        address: CONTRACT_ADDRESS,
        functionName: "getTool",
        args: [toolIdx],
      });

      setTool(tool);
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

      <Text size="sm" c="dimmed">
        {tool.desc}
      </Text>

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

      {/* <Button color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
      </Button> */}
    </Card>
  );
};

export default ViewTool;
