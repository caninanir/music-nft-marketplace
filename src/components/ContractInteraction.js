import React, { useState } from 'react';
   import { ethers } from 'ethers';

   const ContractInteraction = () => {
     const [testNumber, setTestNumber] = useState(0);
     const [newNumber, setNewNumber] = useState('');
     const contractAddress = '0xA053a18BC8e3ccefaA991f8c95FEbfbf503445aA'; // Update!
     const contractABI = [
       "function setTestNumber(uint256 _number) public",
       "function showTestNumber() public view returns (uint256)"
     ];

     const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
     const signer = provider.getSigner(0); // Use the first account provided by Ganache
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