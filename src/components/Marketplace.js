import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";

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
    
    const nftCount = await contract.tokenCount(); // assuming the contract has a public tokenCount function
    const data = [];

    for (let i = 1; i <= nftCount; i++) {
      const tokenURI = await contract.tokenURI(i); // assuming the contract follows the ERC721 standard and implements this function
      const tokenMeta = await fetch(tokenURI).then(res => res.json());
      data.push({
        id: i,
        tokenURI,
        tokenMeta
      });
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

    // assuming the NFT price is fixed and is defined in the smart contract
    const price = await contract.price();
    await contract.buyToken(id, { value: price });
    alert("NFT purchased successfully!");
  };

  return (
    <div>
      <h2>NFT Marketplace</h2>
      {nfts.map((nft, idx) => (
        <div key={idx}>
          <img src={nft.tokenMeta.image} alt={nft.tokenMeta.name} />
          <h3>{nft.tokenMeta.name}</h3>
          <p>{nft.tokenMeta.description}</p>
          <button onClick={() => buyNFT(nft.id)}>Buy with ETH</button>
        </div>
      ))}
    </div>
  );
}