import React, { useState, useCallback, useMemo } from 'react';
import Web3 from 'web3';
import { ChainlinkPlugin, MainnetPriceFeeds } from "@chainsafe/web3-plugin-chainlink";
import './CryptoList.css';
import Notification from './Notification';
import BigNumber from 'bignumber.js';

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
  const [amounts, setAmounts] = useState({});
  const [convertTo, setConvertTo] = useState({});
  const [convertedAmounts, setConvertedAmounts] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Initialize web3 using useMemo
  const web3 = useMemo(() => {
    const instance = new Web3(window.ethereum);
    instance.registerPlugin(new ChainlinkPlugin());
    return instance;
  }, []);

  // Fetch crypto prices using useCallback
  const getCryptoPrices = useCallback(async () => {
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
  }, [cryptoPrices, web3]);

  const handleAmountChange = (crypto, value) => {
    setAmounts((prev) => ({ ...prev, [crypto]: value }));
  };

  const handleConvertToChange = (crypto, value) => {
    setConvertTo((prev) => ({ ...prev, [crypto]: value }));
  };

  const convertAmount = async (crypto, amount, toCrypto) => {
    const fromPrice = cryptoPrices.find(c => c.name === crypto)?.price;
    const toPrice = cryptoPrices.find(c => c.name === toCrypto)?.price;

    if (fromPrice === 'N/A' || toPrice === 'N/A') {
      return 'N/A';
    }

    try {
      const fromPriceBN = new BigNumber(fromPrice);
      const toPriceBN = new BigNumber(toPrice);

      const converted = new BigNumber(amount).multipliedBy(fromPriceBN).dividedBy(toPriceBN);
      return converted.toFixed(6);
    } catch (error) {
      console.error('Error converting amount', error);
      return 'N/A';
    }
  };

  const handleConversion = async () => {
    const results = await Promise.all(cryptoPrices.map(async (crypto) => {
      const amount = amounts[crypto.name];
      const toCrypto = convertTo[crypto.name];
      if (amount && toCrypto) {
        const convertedAmount = await convertAmount(crypto.name, amount, toCrypto);
        return { crypto: crypto.name, convertedAmount };
      }
      return { crypto: crypto.name, convertedAmount: 'N/A' };
    }));
    setConvertedAmounts(results.reduce((acc, { crypto, convertedAmount }) => {
      acc[crypto] = convertedAmount;
      return acc;
    }, {}));
  };

  return (
    <div className="crypto-list">
      <h2>Welcome! Here are the latest crypto prices:</h2>
      <button className="getprice" onClick={getCryptoPrices}>Get Crypto Prices</button>
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Crypto</th>
            <th>Price (USD)</th>
            <th>Amount</th>
            <th>Convert To</th>
            <th>Convert</th>
            <th>Converted Amount</th>
          </tr>
        </thead>
        <tbody>
          {cryptoPrices.map((crypto, index) => (
            <tr key={index}>
              <td>{crypto.name}</td>
              <td>{crypto.price}</td>
              <td>
                <input
                  type="number"
                  value={amounts[crypto.name] || ''}
                  onChange={(e) => handleAmountChange(crypto.name, e.target.value)}
                  placeholder="Enter amount"
                />
              </td>
              <td>
                <select
                  value={convertTo[crypto.name] || ''}
                  onChange={(e) => handleConvertToChange(crypto.name, e.target.value)}
                >
                  {(crypto.name === 'BTC' ? ['ETH', 'USDC-USD'] : crypto.name === 'ETH' ? ['BTC', 'USDC-USD'] : ['BTC', 'ETH']).map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleConversion()}>Convert</button> {/* Button in new column */}
              </td>
              <td>{convertedAmounts[crypto.name] || 'N/A'}</td>
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
