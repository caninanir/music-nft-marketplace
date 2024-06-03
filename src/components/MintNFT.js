import React, { useState } from 'react';
import { ethers } from 'ethers';
import MusicNFT from '../artifacts/contracts/MusicNFT.json';

const contractAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

export default function MintNFT() {
  const [songURL, setSongURL] = useState("");
  const [coverURL, setCoverURL] = useState("");
  const [metadata, setMetadata] = useState("");

  const mintNFT = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required to mint an NFT");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, MusicNFT.abi, signer);

      console.log("Minting NFT with the following details:");
      console.log("Song URL:", songURL);
      console.log("Cover URL:", coverURL);
      console.log("Metadata:", metadata);

      const transaction = await contract.mintNFT(
        await signer.getAddress(),
        songURL,
        coverURL,
        metadata
      );

      await transaction.wait();
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed: " + error.message);
    }
  };

  return (
    <div>
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
    </div>
  );
}