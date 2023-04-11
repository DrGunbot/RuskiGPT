import { createClient, Connector } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Web3Provider } from "@ethersproject/providers";

const Injected = new Connector({
  connect: async () => {
    if (!window.ethereum) throw new Error("No injected provider found.");
    await window.ethereum.enable();
    return new Web3Provider(window.ethereum);
  },
});

const WalletConnect = new Connector({
  connect: async () => {
    const WalletConnectProvider = (await import("@walletconnect/web3-provider")).default;
    const provider = new WalletConnectProvider({ rpc: { 1: mainnet.rpc.url } });
    await provider.enable();
    return new Web3Provider(provider);
  },
});

const wagmiClient = createClient({
  chains: { 1: mainnet },
  connectors: {
    injected: {
      connector: Injected,
      options: {},
    },
    walletconnect: {
      connector: WalletConnect,
      options: {},
    },
  },
  options: { factory: () => new Web3Provider(window.ethereum) },
});

export default wagmiClient;
