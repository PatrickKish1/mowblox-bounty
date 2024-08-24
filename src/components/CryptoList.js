import React, { useState } from 'react';
import { Web3 } from "web3";
import { ChainlinkPlugin, MainnetPriceFeeds } from "@chainsafe/web3-plugin-chainlink";
import './CryptoList.css';

function CryptoList() {
  const initialCryptos = [
    { name: "BTC", price: "000" },
    { name: "ETH", price: "000" },
    { name: "LTC", price: "000" },
    { name: "BNB", price: "000" },
    { name: "ADA", price: "000" },
    { name: "XRP", price: "000" },
    { name: "DOT", price: "000" },
    { name: "DOGE", price: "000" },
    { name: "LINK", price: "000" },
    { name: "UNI", price: "000" }
  ];
  
  const [cryptoPrices, setCryptoPrices] = useState(initialCryptos);

  const web3 = new Web3(window.ethereum);
  web3.registerPlugin(new ChainlinkPlugin());

  async function getCryptoPrices() {
    const updatedPrices = [...cryptoPrices];
    
    // Fetching prices (mockup, need to map these cryptos with MainnetPriceFeeds)
    const cryptos = [MainnetPriceFeeds.BtcUsd, MainnetPriceFeeds.EthUsd]; // Add other feeds as necessary

    for (let i = 0; i < cryptos.length; i++) {
      const price = await web3.chainlink.getPrice(cryptos[i]);
      updatedPrices[i].price = price.answer.toString().substring(0, 5);
    }

    setCryptoPrices(updatedPrices);
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
