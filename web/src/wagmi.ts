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
    appUrl: "https://family.co",
    appIcon: "https://family.co/logo.png",
  })
);

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
