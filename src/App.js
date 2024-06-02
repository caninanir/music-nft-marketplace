import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
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

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/mint" component={MintNFT} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/upload" component={Upload} />
          <Route path="/" exact>
            <h2>Welcome to Music NFT Marketplace</h2>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;