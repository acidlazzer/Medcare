"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: totalCounter } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "count",
  });

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const clientId = "BNrUhj1UB5PbmJOSM_LXh6pOWrdTYfMrIB-N4gy8hNt1HDu-exzZLCRPjaeWv1qPtvXPd9rFDHWkiCkmTMKQkb8";

  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  //Update to the final chain we will deploy
  const chainConfig = {
    chainId: "0x1", // Please use 0x1 for Mainnet
    rpcTarget: "https://rpc.ankr.com/eth",
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    displayName: "Ethereum Mainnet",
    blockExplorerUrl: "https://etherscan.io/",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://images.toruswallet.io/eth.svg",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig: chainConfig },
  });

  const web3auth = new Web3Auth({
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    privateKeyProvider: privateKeyProvider,
  });

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) {
      return;
    }
    await web3auth.initModal();
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }
  };

  return (
    <>
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          <Address address={connectedAddress} />
          <h2 className="card-title">Shoes!</h2>
          <p>counter: {totalCounter?.toString()}</p>
          <div className="card-FFactions justify-end">
            <button
              className="btn btn-primary"
              onClick={async () => {
                // try {
                //   await writeYourContractAsync({
                //     functionName: "createRecord",
                //     args: [timestamp,mensaje 1],
                //   });
                // } catch (e) {
                //   console.error("Error setting greeting:", e);
                // }
              }}
            >
              Set Greeting
            </button>
          </div>
        </div>
      </div>
      <div className="card card-compact bg-base-100 w-96 shadow-xl">
        <div className="card-body">
          {/* <Address address={web3AuthAddress} /> */}
          <h2 className="card-title">Connect</h2>
          {/* <p>counter: {totalCounter?.toString()}</p> */}
          <div className="card-FFactions justify-end">
            <button className="btn btn-primary" onClick={login}>
              Connect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
