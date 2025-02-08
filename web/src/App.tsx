import { Web3Provider } from "./Web3Provider";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import Home from "./components/Home";

const App = () => {
  return (
    <Web3Provider>
      <MantineProvider>
        <Home />
      </MantineProvider>
    </Web3Provider>
  );
};

export default App;
