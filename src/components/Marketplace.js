import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MusicNFT from '../artifacts/contracts/MusicNFT.json';

const contractAddress = "0x9A358482b63b4718F899ee7cA92dfBA4885A5eb6";

export default function Marketplace() {
  const [nfts, setNfts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState('');

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
          const price = await contract.getPrice(i);
          const item = {
            id: i,
            songURL: song.songURL,
            coverURL: song.coverURL,
            metadata: song.metadata,
            price: ethers.utils.formatEther(price)
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

  const buyNFT = async (id, price) => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is required to buy an NFT");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

    try {
      logMessage(`Buying NFT ${id} for ${price} ETH...`);
      const transaction = await contract.buyNFT(id, { value: ethers.utils.parseEther(price) });
      await transaction.wait();
      logMessage(`NFT ${id} purchased successfully!`);
      loadNFTs(); // Refresh NFTs
    } catch (error) {
      console.error("Buying failed:", error);
      logMessage(`Buying failed: ${error.message}`);
    }
  };

  const setNFTPrice = async (id) => {
    if (!selectedPrice) {
      alert("Please provide a price.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

    try {
      logMessage(`Setting price for NFT ${id} to ${selectedPrice} ETH...`);
      const transaction = await contract.setPrice(id, ethers.utils.parseEther(selectedPrice));
      await transaction.wait();
      logMessage(`Price for NFT ${id} set to ${selectedPrice} ETH successfully!`);
      setSelectedPrice('');
      loadNFTs(); // Refresh NFTs
    } catch (error) {
      console.error("Setting price failed:", error);
      logMessage(`Setting price failed: ${error.message}`);
    }
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
          <p>Price: {nft.price} ETH</p>
          <input
            type="text"
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            placeholder="Enter price in ETH"
          />
          <button onClick={() => setNFTPrice(nft.id)}>Set Price</button>
          <button onClick={() => buyNFT(nft.id, nft.price)}>Buy with ETH</button>
        </div>
      ))}

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
