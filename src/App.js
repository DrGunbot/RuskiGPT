import React from "react";
import "./App.css";
import Background from "./components/Background";
import Chatbot from "./components/Chatbot";
import NavBar from "./components/NavBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { arbitrum, mainnet, polygon } from 'wagmi/chains';
import PurchasePage from "./components/PurchasePage";
import RandomLetters from "./components/HomeText";

const chains = [arbitrum, mainnet, polygon];
const projectId = process.env.REACT_APP_PROJECT_ID
const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

function App() {
  return (
    <Router>
      <WagmiConfig client={wagmiClient}>
        <Background />
        <NavBar projectId={projectId} ethereumClient={ethereumClient} />
        <Routes>
          <Route path="/" element={<RandomLetters />} />
          {/* <Route path="/news" element={<RandomLetters />} /> */}
          <Route path="/buy" element={<PurchasePage ethereumClient={ethereumClient} />} />
        </Routes>
        <Chatbot ethereumClient={ethereumClient} />
      </WagmiConfig>
    </Router>
  );
}

export default App;