import React, { useState } from 'react';
import { ethers } from 'ethers';

const ContractInteraction = () => {
  const [testNumber, setTestNumber] = useState(0);
  const [newNumber, setNewNumber] = useState('');
  const contractAddress = '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99';
  const contractABI = [
    "function setTestNumber(uint256 _number) public",
    "function showTestNumber() public view returns (uint256)"
  ];

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const handleSetNumber = async () => {
    if (newNumber === '') return;
    try {
      const tx = await contract.setTestNumber(newNumber);
      await tx.wait();
      alert('Number set successfully!');
    } catch (error) {
      console.error('Error setting number:', error);
    }
  };

  const fetchTestNumber = async () => {
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
