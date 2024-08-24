// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import modern styles for the header

function Header() {
  return (
    <header className="App-header">
      <div className="logo">
        <h1>Crypto Dashboard</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/gas-fee-checker">Gas Fee Checker</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
