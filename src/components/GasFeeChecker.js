import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import './GasFeeChecker.css';
import Notification from './Notification';

function GasFeeChecker() {
  const [crypto, setCrypto] = useState('ETH');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [gasPrice, setGasPrice] = useState(null); // Current gas price

  // Initialize Web3 with MetaMask
  const web3 = useMemo(() => {
    if (window.ethereum) {
      return new Web3(window.ethereum);
    } else {
      setNotificationMessage('MetaMask is not installed.');
      setShowNotification(true);
      return null;
    }
  }, []);

  const fetchGasPrices = useCallback(async () => {
    if (!web3) return; // Exit if web3 is not initialized

    try {
      if (crypto === 'ETH') {
        // Get the current gas price for Ethereum directly
        const gasPriceInWei = await web3.eth.getGasPrice();
        const gasPriceInGwei = web3.utils.fromWei(gasPriceInWei, 'gwei');
        setGasPrice(gasPriceInGwei); // Display in Gwei
      } else if (crypto === 'BTC') {
        // For BTC, let's use an external API to get the estimated transaction fee
        const response = await axios.get('https://mempool.space/api/v1/fees/recommended');
        const btcGasPrice = response.data.fastestFee; // in satoshis per byte
        setGasPrice(btcGasPrice); // Display in satoshis per byte
      }
    } catch (error) {
      console.error('Error fetching gas prices:', error);
      setNotificationMessage('Failed to fetch gas prices.');
      setShowNotification(true);
    }
  }, [crypto, web3]);

  useEffect(() => {
    fetchGasPrices();
  }, [fetchGasPrices]);

  async function checkGasFee() {
    if (!amount || isNaN(amount)) {
      setNotificationMessage('Please enter a valid amount.');
      setShowNotification(true);
      return;
    }

    try {
      if (crypto === 'ETH') {
        const gasPriceInWei = await web3.eth.getGasPrice();
        const gasLimit = 21000; // Typical gas limit for a simple ETH transfer
        const totalGasFeeInWei = new BigNumber(gasPriceInWei).multipliedBy(gasLimit);
        const totalGasFeeInEth = web3.utils.fromWei(totalGasFeeInWei.toString(), 'ether');

        let totalGasFee;

        if (currency === 'USD') {
          const ethPriceInUSD = await getEthPriceInUSD();
          totalGasFee = new BigNumber(totalGasFeeInEth).multipliedBy(ethPriceInUSD);
        } else {
          totalGasFee = totalGasFeeInEth;
        }

        setGasFee(totalGasFee.toFixed(6));
      } else if (crypto === 'BTC') {
        const btcGasPrice = gasPrice; // in satoshis per byte
        if (!btcGasPrice) {
          setNotificationMessage('Bitcoin gas price not available.');
          setShowNotification(true);
          return;
        }
        const txSize = 250; // Average transaction size in bytes
        const totalGasFeeInSatoshis = new BigNumber(btcGasPrice).multipliedBy(txSize);

        let totalGasFee;
        if (currency === 'USD') {
          const btcPriceInUSD = await getBtcPriceInUSD();
          totalGasFee = totalGasFeeInSatoshis.dividedBy(1e8).multipliedBy(btcPriceInUSD);
        } else {
          totalGasFee = totalGasFeeInSatoshis.dividedBy(1e8); // Convert satoshis to BTC
        }

        setGasFee(totalGasFee.toFixed(6));
      }
    } catch (error) {
      console.error('Error calculating gas fee:', error);
      setNotificationMessage('Failed to calculate gas fee.');
      setShowNotification(true);
    }
  }

  async function getEthPriceInUSD() {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    return response.data.ethereum.usd;
  }

  async function getBtcPriceInUSD() {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    return response.data.bitcoin.usd;
  }

  return (
    <div className="gas-fee-checker">
      <h2>Gas Fee Checker</h2>
      <label>
        Select Crypto:
        <select value={crypto} onChange={(e) => setCrypto(e.target.value)}>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="BTC">Bitcoin (BTC)</option>
        </select>
      </label>
      <label>
        Select Currency:
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USD">USD</option>
          <option value={crypto}>{crypto}</option>
        </select>
      </label>
      <label>
        Enter Amount (in {currency}):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`Amount in ${currency}`}
        />
      </label>
      <button onClick={checkGasFee}>Check Gas Fee</button>
      {gasFee !== null && (
        <div className="gas-fee-display">
          <p>Current {crypto} Gas Price: {gasPrice} {crypto === 'ETH' ? 'Gwei' : 'satoshis/byte'}</p>
          <p>Estimated Gas Fee: {currency === 'USD' ? '$' : ''}{gasFee} {currency}</p>
        </div>
      )}
      <Notification 
        message={notificationMessage} 
        show={showNotification} 
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default GasFeeChecker;
