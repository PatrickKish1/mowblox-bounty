// src/components/CryptoList.js
import React, { useState } from 'react';
import Web3 from 'web3';
import { ChainlinkPlugin, MainnetPriceFeeds } from "@chainsafe/web3-plugin-chainlink";
import './CryptoList.css';
import Notification from './Notification';

function CryptoList() {
  const initialCryptos = [
    { name: "BTC", feed: MainnetPriceFeeds.BtcUsd, price: "N/A" },
    { name: "ETH", feed: MainnetPriceFeeds.EthUsd, price: "N/A" },
    { name: "USDT-USD", feed: MainnetPriceFeeds.UsdtUsd, price: "N/A" },
    { name: "APE", feed: MainnetPriceFeeds.ApeUsd, price: "N/A" },
    { name: "USDC-USD", feed: MainnetPriceFeeds.UsdcUsd, price: "N/A" },
    { name: "BNB-USD", feed: MainnetPriceFeeds.BnbUsd, price: "N/A" },
    { name: "ETH-BTC", feed: MainnetPriceFeeds.EthBtc, price: "N/A" },
    { name: "JPY-USD", feed: MainnetPriceFeeds.JpyUsd, price: "N/A" },
    { name: "SOL", feed: MainnetPriceFeeds.SolUsd, price: "N/A" }
  ];

  const [cryptoPrices, setCryptoPrices] = useState(initialCryptos);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const web3 = new Web3(window.ethereum);
  web3.registerPlugin(new ChainlinkPlugin());

  async function getCryptoPrices() {
    try {
      const updatedPrices = await Promise.all(cryptoPrices.map(async (crypto) => {
        try {
          const price = await web3.chainlink.getPrice(crypto.feed);
          const formattedPrice = price.answer.toString().substring(0, 6);
          return { ...crypto, price: formattedPrice };
        } catch (error) {
          console.error(`Error fetching price for ${crypto.name}`, error);
          return { ...crypto, price: 'N/A' };
        }
      }));
      setCryptoPrices(updatedPrices);
    } catch (error) {
      console.error("Error fetching crypto prices", error);
      setNotificationMessage('Failed to fetch crypto prices.');
      setShowNotification(true);
    }
  }

  return (
    <div className="crypto-list">
      <h2>Welcome! Here are the latest crypto prices:</h2>
      <button onClick={getCryptoPrices}>Get Crypto Prices</button>
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
      <Notification 
        message={notificationMessage} 
        show={showNotification} 
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default CryptoList;
