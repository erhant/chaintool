import { Group, Text } from "@mantine/core";
import type { FC } from "react";

const Footer: FC = () => {
  return (
    <Group gap="xs" mt="lg" align="flex-end" justify="center">
      <Text
        component="a"
        href="https://base-sepolia.blockscout.com/address/0x9eD9db9C2fBD5B913635919BFb4784BcB941b7Fa"
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
