import React, { useState } from 'react';
import axios from 'axios';
import './CryptoList.css';

function CryptoList() {
  const initialCryptos = [
    { name: "BTC", id: "bitcoin", price: "N/A" },
    { name: "ETH", id: "ethereum", price: "N/A" },
    { name: "LTC", id: "litecoin", price: "N/A" },
    { name: "BNB", id: "binancecoin", price: "N/A" },
    { name: "ADA", id: "cardano", price: "N/A" },
    { name: "XRP", id: "ripple", price: "N/A" },
    { name: "DOT", id: "polkadot", price: "N/A" },
    { name: "DOGE", id: "dogecoin", price: "N/A" },
    { name: "LINK", id: "chainlink", price: "N/A" },
    { name: "UNI", id: "uniswap", price: "N/A" }
  ];
  
  const [cryptoPrices, setCryptoPrices] = useState(initialCryptos);

  async function getCryptoPrices() {
    try {
      const ids = cryptoPrices.map(crypto => crypto.id).join(',');
      const response = await axios.get(`http://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
      const updatedPrices = cryptoPrices.map(crypto => ({
        ...crypto,
        price: response.data[crypto.id] ? response.data[crypto.id].usd : 'N/A'
      }));
      setCryptoPrices(updatedPrices);
    } catch (error) {
      console.error("Error fetching crypto prices", error);
    }
  }

  return (
    <div className="crypto-list">
      <h2>Welcome! Here are the latest crypto prices:</h2>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {cryptoPrices.map((crypto, index) => (
            <tr key={index}>
              <td>{crypto.name}</td>
              <td>{crypto.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={getCryptoPrices}>Get Crypto Prices</button>
    </div>
  );
}

export default CryptoList;
