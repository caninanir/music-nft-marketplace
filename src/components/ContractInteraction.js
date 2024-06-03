import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ContractInteraction = () => {
  const [testNumber, setTestNumber] = useState(0);
  const [newNumber, setNewNumber] = useState('');
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [logs, setLogs] = useState([]);
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
  ];

  useEffect(() => {
    const init = async () => {
      logMessage('Initializing connection to Ethereum...');
      try {
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
        logMessage('Ethereum connection established.');
      } catch (error) {
        logMessage('Error initializing provider or signer: ' + error.message);
        console.error('Error initializing provider or signer:', error);
      }
    };

    init();
  }, []);
  
  const logMessage = (message) => {
    setLogs(prevLogs => [...prevLogs, message]);
  };

  const handleSetNumber = async () => {
    if (newNumber === '') {
      logMessage('New number input is empty.');
      return;
    }
    if (!contract) {
      logMessage('Contract is not initialized.');
      return;
    }
    try {
      logMessage('Sending transaction to set new number...');
      const tx = await contract.set(newNumber);
      await tx.wait();
      logMessage('Number set successfully!');
      setNewNumber('');
    } catch (error) {
      logMessage('Error setting number: ' + error.message);
      console.error('Error setting number:', error);
    }
  };

  const fetchTestNumber = async () => {
    if (!contract) {
      logMessage('Contract is not initialized.');
      return;
    }
    try {
      logMessage('Fetching test number from contract...');
      const number = await contract.get();
      setTestNumber(number.toNumber());
      logMessage('Test number fetched successfully: ' + number.toNumber());
    } catch (error) {
      logMessage('Error fetching number: ' + error.message);
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
};

export default ContractInteraction;