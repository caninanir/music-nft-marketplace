import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import MusicNFT from '../artifacts/contracts/MusicNFT.json';

const contractAddress = "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8";

export default function Marketplace() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert("MetaMask is required to view NFTs");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, MusicNFT.abi, provider);

    const tokenCount = await contract._tokenIds();
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
      } catch (error) {
        console.error("Error fetching song: ", error);
      }
    }

    setNfts(data);
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
    <div>
      <h2>NFT Marketplace</h2>
      {nfts.map((nft, idx) => (
        <div key={idx}>
          <img src={nft.coverURL} alt={nft.metadata} />
          <h3>{nft.metadata}</h3>
          <audio controls src={nft.songURL}></audio>
          <button onClick={() => buyNFT(nft.id)}>Buy with ETH</button>
        </div>
      ))}
    </div>
  );
}