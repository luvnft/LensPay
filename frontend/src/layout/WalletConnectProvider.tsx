import { ReactNode } from "react";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import { WagmiConfig, createConfig } from "wagmi";

import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const chains = [polygonMumbai, polygon, mainnet, sepolia]

const config = createConfig(
  getDefaultConfig({
    chains,
    // Required API Keys
    alchemyId: process.env.ALCHEMY_ID, // or infuraId
    walletConnectProjectId: projectId,

    // Required
    appName: "Your App Name",

    // Optional
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

createWeb3Modal({ wagmiConfig: config, projectId, chains })

const metadata = {
  name: "Lens Hello World Open Action",
  description: "Demo of Lens open action calling helloWorld function",
  url: "https://hello-world-open-action.vercel.com",
  icons: [
    "https://ipfs.io/ipfs/QmQGYyua2hhaZa6ByemzyA2xvDhbgcCeMmF6pxhjZ2Y9a1",
  ],
};

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({ wagmiConfig, projectId, chains });

interface Props {
  children?: ReactNode;
}

export function WalletConnectProvider({ children }: Props) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        {children}
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
