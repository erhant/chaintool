import { WalletDefault } from "@coinbase/onchainkit/wallet";
import { Group, Stack, Text, Title } from "@mantine/core";
import type { FC } from "react";

const Header: FC = () => {
  return (
    <Group p="xs">
      <Stack gap="xs">
        <Title order={1}>Chaintool Viewer</Title>
        <Text>View all dynamic & agentic tools on-chain!</Text>
      </Stack>

      <span style={{ flexGrow: 1 }} />
      <WalletDefault />
    </Group>
  );
};

export default Header;
