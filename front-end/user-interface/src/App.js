import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import { SideBar } from './components/Sidebar';
import Dashboard from './components/Dashboard';

class App extends Component {
  render() {
    return (
      <div>
        {/* <SideBar /> */}
        <Dashboard />
      </div>
    );
  }
}

export default App;
