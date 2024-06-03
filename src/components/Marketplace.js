import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MusicNFT from '../artifacts/contracts/MusicNFT.json';

const contractAddress = "0x707a1dC41eB156cE43580Ca66df717511d42F299";

export default function Marketplace() {
  const [nfts, setNfts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [testNum, setTestNum] = useState('');
  const [fetchedTestNum, setFetchedTestNum] = useState(null);

  useEffect(() => {
    loadNFTs();
  }, []);

  const logMessage = (message) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const loadNFTs = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is required to view NFTs");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, MusicNFT.abi, provider);

    logMessage('Loading NFTs from the contract...');
    
    try {
      const tokenCount = await contract.getTokenCount();
      logMessage(`Token count retrieved: ${tokenCount}`);
      const data = [];

      for (let i = 1; i <= tokenCount; i++) {
        try {
          const song = await contract.getSong(i);
          const item = {
            id: i,
            songURL: song.songURL,
            coverURL: song.coverURL,
            metadata: song.metadata
          };
          data.push(item);
          logMessage(`NFT ${i} - ${song.metadata} loaded.`);
        } catch (error) {
          console.error("Error fetching song: ", error);
          logMessage(`Error fetching NFT ${i}: ${error.message}`);
        }
      }

      setNfts(data);
    } catch (error) {
      console.error("Error loading NFTs: ", error);
      logMessage(`Error loading NFTs: ${error.message}`);
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
      const contract = new ethers.Contract(contractAddress, MusicNFT.abi, provider);

      const num = await contract.getTestNum();
      setFetchedTestNum(num.toNumber());

      logMessage(`Test number fetched: ${num.toNumber()}`);
    } catch (error) {
      console.error("Getting test number failed:", error);
      logMessage(`Getting test number failed: ${error.message}`);
    }
  };

  const buyNFT = async (id) => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is required to buy an NFT");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

    // assuming the NFT price is fixed and defined in the smart contract
    // const price = await contract.price();
    // await contract.buyToken(id, { value: price });
    alert("NFT purchase functionality to be implemented!");
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>NFT Marketplace</h2>
      <button onClick={loadNFTs}>Reload NFTs</button>
      {nfts.map((nft, idx) => (
        <div key={idx}>
          <img src={nft.coverURL} alt={nft.metadata} style={{ width: '200px', height: '200px' }} />
          <h3>{nft.metadata}</h3>
          <audio controls src={nft.songURL}></audio>
          <button onClick={() => buyNFT(nft.id)}>Buy with ETH</button>
        </div>
      ))}

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