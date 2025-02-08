import { Container } from "@mantine/core";
import { useAccount } from "wagmi";
import Header from "./Header";
import type { FC } from "react";

import Register from "./ViewTools";
import Footer from "./Footer";

const Home: FC = () => {
  const { isConnected } = useAccount();

  return (
    <Container p="sm" h="100vh">
      <Header />
      <Container size="sm">{isConnected && <Register />}</Container>
      <Footer />
    </Container>
  );
};

export default Home;
