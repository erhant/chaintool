import { Container, Title } from "@mantine/core";
import { useAccount } from "wagmi";
import type { FC } from "react";

import Header from "./Header";
import ToolMenu from "./ToolMenu";
import Footer from "./Footer";

const Home: FC = () => {
  const { isConnected } = useAccount();

  return (
    <Container p="sm" h="100vh">
      <Header />
      <Container size="sm">
        {isConnected ? (
          <ToolMenu />
        ) : (
          <Title>Please connect your wallet to continue!</Title>
        )}
      </Container>
      <Footer />
    </Container>
  );
};

export default Home;
