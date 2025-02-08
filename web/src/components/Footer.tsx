import { Group, Text } from "@mantine/core";
import type { FC } from "react";

const Footer: FC = () => {
  return (
    <Group gap="xs" mt="lg" align="flex-end" justify="center">
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
