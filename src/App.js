// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import CryptoList from './components/CryptoList';
import GasFeeChecker from './components/GasFeeChecker';
import Footer from './components/Footer';
import Header from './components/Header'; // Import your Header component

function App() {
  return (
    <Router>
      <div className="App">
        <Header /> {/* Use the Header component */}
        <main className="App-content">
          <Routes>
            <Route path="/" element={<CryptoList />} />
            <Route path="/gas-fee-checker" element={<GasFeeChecker />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
