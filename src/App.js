import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AuthStatus from './components/AuthStatus';
import Login from './components/Login';
import Signup from './components/Signup';
import WalletConnect from './components/WalletConnect';
import MintNFT from './components/MintNFT';
import Marketplace from './components/Marketplace';
import Upload from './components/Upload';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          <Link to="/mint">Mint NFT</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/upload">Upload</Link>
        </nav>

        <AuthStatus />
        <WalletConnect />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mint" element={<MintNFT />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/" element={<h2>Welcome to Music NFT Marketplace</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;