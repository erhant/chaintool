import { Group, Text } from "@mantine/core";
import type { FC } from "react";

const Footer: FC = () => {
  return (
    <Group gap="xs" mt="md" p="lg" align="flex-end" justify="center">
      <Text
        component="a"
        href="https://base-sepolia.blockscout.com/address/0x5d29f6180A7a3D02623c1F74e4244C53beAA1c53"
        target="_blank"
      >
        Contract
      </Text>
      <Text>◆</Text>
      <Text
        component="a"
        href="https://github.com/erhant/chaintool"
        target="_blank"
      >
        GitHub
      </Text>
    </Group>
  );
};

export default Footer;
