import ReactDOM from "react-dom/client";
import App from "./App";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli, avalancheFuji } from "wagmi/chains";

import { Web3Modal } from "@web3modal/react";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";

const projectId = "18a2ef73f8197afdd99e990e00c6b13d";
const chains = [mainnet, goerli, avalancheFuji];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
);
