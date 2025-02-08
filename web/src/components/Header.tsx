import { Group, Stack, Text, Title } from "@mantine/core";
import { ConnectKitButton } from "connectkit";
import type { FC } from "react";

const Header: FC = () => {
  return (
    <Group p="xs">
      <Stack gap="xs">
        <Title order={1}>Chaintool</Title>
        <Text>Dynamic & agentic tools on-chain!</Text>
      </Stack>

      <span style={{ flexGrow: 1 }} />
      <ConnectKitButton showBalance mode="light" />
    </Group>
  );
};

export default Header;
