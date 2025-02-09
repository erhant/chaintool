import { createConfig } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { baseSepolia } from "wagmi/chains";
import { http } from "wagmi";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: "onchainkit",
    }),
  ],
  ssr: true,
  transports: {
    [baseSepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
