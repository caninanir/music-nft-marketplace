
import React, { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(selectedAddress);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask is not installed!");
    }
  };

  return (
    <div className="wallet-connect">
      <button onClick={connectWallet}>Connect Wallet</button>
      {walletAddress && <p>Wallet Address: {walletAddress}</p>}
    </div>
  );
}