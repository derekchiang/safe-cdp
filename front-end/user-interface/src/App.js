import React, { Component } from 'react';
import Web3 from "web3";

import logo from './logo.svg';
import './App.css';
import UserAccess from './UserAccess/UserAccess';

class App extends Component {
  render() {
    return (
      <div>
        <UserAccess />
      </div>
    );
  }

  async componentDidMount() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }
}

export default App;
