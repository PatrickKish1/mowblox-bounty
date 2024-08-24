import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CryptoList from './components/CryptoList';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="App-content">
        <CryptoList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
