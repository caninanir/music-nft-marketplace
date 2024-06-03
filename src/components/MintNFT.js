import React, { useState } from 'react';
import { ethers } from 'ethers';
import MusicNFT from '../artifacts/contracts/MusicNFT.json';

const contractAddress = "0x9A358482b63b4718F899ee7cA92dfBA4885A5eb6"; // Ensure this matches your deployed contract

export default function MintNFT() {
  const [songURL, setSongURL] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [metadata, setMetadata] = useState("");
  const [testNum, setTestNum] = useState("");
  const [fetchedTestNum, setFetchedTestNum] = useState(null);
  const [logs, setLogs] = useState([]);

  const logMessage = (message) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const mintNFT = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to mint an NFT");
      return;
    }

    if (!songURL || !coverURL || !metadata) {
      alert("Please provide all the fields: Song URL, Cover URL, and Metadata.");
      return;
    }

    try {
      logMessage("Connecting to Ethereum provider...");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

      logMessage("Minting NFT with the following details:");
      logMessage(`Song URL: ${songURL}`);
      logMessage(`Cover URL: ${coverURL}`);
      logMessage(`Metadata: ${metadata}`);

      const transaction = await contract.mintNFT(
        await signer.getAddress(),
        songURL,
        coverURL,
        metadata
      );

      logMessage("Transaction sent. Waiting for confirmation...");
      await transaction.wait();
      logMessage("NFT minted successfully!");

      // Clear inputs
      setSongURL('');
      setCoverURL('');
      setMetadata('');
    } catch (error) {
      console.error("Minting failed:", error);
      logMessage(`Minting failed: ${error.message}`);
      if (error.data && error.data.message) {
        logMessage(`Minting failed: ${error.data.message}`);
      }
    }
  };

  const handleSetTestNum = async () => {
    if (!testNum) {
      alert("Please provide a test number.");
      return;
    }

    try {
      logMessage("Setting test number...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

      const transaction = await contract.setTestNum(testNum);
      await transaction.wait();
      
      logMessage(`Test number set to ${testNum} successfully!`);
      setTestNum('');
    } catch (error) {
      console.error("Setting test number failed:", error);
      logMessage(`Setting test number failed: ${error.message}`);
    }
  };

  const handleGetTestNum = async () => {
    try {
      logMessage("Getting test number...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

      const num = await contract.getTestNum();
      setFetchedTestNum(num.toNumber());

      logMessage(`Test number fetched: ${num.toNumber()}`);
    } catch (error) {
      console.error("Getting test number failed:", error);
      logMessage(`Getting test number failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mint NFT</h2>
      <input 
        type="text" 
        value={songURL} 
        onChange={(e) => setSongURL(e.target.value)} 
        placeholder="Song URL" 
      />
      <input 
        type="text" 
        value={coverURL} 
        onChange={(e) => setCoverURL(e.target.value)} 
        placeholder="Cover URL" 
      />
      <input 
        type="text" 
        value={metadata} 
        onChange={(e) => setMetadata(e.target.value)} 
        placeholder="Metadata (e.g., Title)" 
      />
      <button onClick={mintNFT}>Mint NFT</button>
      
      <h3>Test Contract Connection</h3>
      <input
        type="number"
        value={testNum}
        onChange={(e) => setTestNum(e.target.value)}
        placeholder="Test Number"
      />
      <button onClick={handleSetTestNum}>Set Test Number</button>
      <button onClick={handleGetTestNum}>Get Test Number</button>
      {fetchedTestNum !== null && <p>Current Test Number: {fetchedTestNum}</p>}

      <div style={{ marginTop: '20px' }}>
        <h3>Logs</h3>
        <textarea
          rows="10"
          cols="50"
          value={logs.join('\n')}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}
