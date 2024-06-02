import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import AuthStatus from './components/AuthStatus';
import WalletConnect from './components/WalletConnect';


function App() {
  return (
    <Router>
      <div>
        <AuthStatus />
        <WalletConnect />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          {/* Add more routes as needed */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
