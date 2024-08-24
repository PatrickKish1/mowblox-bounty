// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/gas-fee-checker">Gas Fee Checker</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
