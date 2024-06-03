import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';

const ContractInteraction = () => {
  const [testNumber, setTestNumber] = useState(0);
  const [newNumber, setNewNumber] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const contractAddress = '0x202B173Bb64bDC3E09b57e86bB5bd6a7AdAcfE36'; // Update with your deployed contract address
  const contractABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "data",
          "type": "uint256"
        }
      ],
      "name": "DataStored",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storedData",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  

  useEffect(() => {
    const init = async () => {
      // Setting up Web3 Provider
      const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");

      // Request account access if needed
      await _provider.send("eth_requestAccounts", []);

      // Getting the first account
      const _signer = _provider.getSigner();
      const _contract = new ethers.Contract(contractAddress, contractABI, _signer);

      setProvider(_provider);
      setSigner(_signer);
      setContract(_contract);
    };

    init();
  }, []);
  
  const handleSetNumber = async () => {
    if (newNumber === '' || !contract) return;
    try {
      const tx = await contract.setTestNumber(newNumber);
      await tx.wait();
      alert('Number set successfully!');
    } catch (error) {
      console.error('Error setting number:', error);
    }
  };

  const fetchTestNumber = async () => {
    if (!contract) return;
    try {
      const number = await contract.showTestNumber();
      setTestNumber(number.toNumber());
    } catch (error) {
      console.error('Error fetching number:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Blockchain Test</h1>
      <div>
        <input
          type="number"
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
          placeholder="Enter new number"
        />
        <button onClick={handleSetNumber}>Set Number</button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <button onClick={fetchTestNumber}>Show Test Number</button>
        <p>Current Test Number: {testNumber}</p>
      </div>
    </div>
  );
};

export default ContractInteraction;