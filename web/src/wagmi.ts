import { createConfig } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { baseSepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    connectors: [
      injected(),
      coinbaseWallet(),
      walletConnect({ projectId: "" }),
    ],

    walletConnectProjectId: "",

    appName: "Chaintool",
    appDescription: "View chaintool tools online.",
    appUrl: "https://github.com/erhant/chaintools",
    appIcon:
      "https://raw.githubusercontent.com/erhant/chaintools/refs/heads/main/misc/logo.png",
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
