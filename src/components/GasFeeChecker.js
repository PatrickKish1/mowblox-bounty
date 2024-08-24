// src/components/GasFeeChecker.js

import React, { useState } from 'react';
import Web3 from 'web3';
import './GasFeeChecker.css';
import Notification from './Notification';

function GasFeeChecker() {
  const [crypto, setCrypto] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [gasFee, setGasFee] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const web3 = new Web3(window.ethereum);

  async function checkGasFee() {
    if (!amount || isNaN(amount)) {
      setNotificationMessage('Please enter a valid amount.');
      setShowNotification(true);
      return;
    }

    try {
      const gasPrice = await web3.eth.getGasPrice();
      const gasPriceInEth = web3.utils.fromWei(gasPrice, 'ether');
      const gasLimit = 21000;
      const totalGasFee = gasPriceInEth * gasLimit;
      const totalGasFeeInUSD = totalGasFee * amount;

      setGasFee(totalGasFeeInUSD.toFixed(6));
    } catch (error) {
      console.error('Error calculating gas fee:', error);
      setNotificationMessage('Failed to calculate gas fee.');
      setShowNotification(true);
    }
  }

  return (
    <div className="gas-fee-checker">
      <h2>Gas Fee Checker</h2>
      <label>
        Select Crypto:
        <select value={crypto} onChange={(e) => setCrypto(e.target.value)}>
          <option value="ETH">Ethereum (ETH)</option>
        </select>
      </label>
      <label>
        Enter Amount (in ETH):
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </label>
      <button onClick={checkGasFee}>Check Gas Fee</button>
      {gasFee !== null && (
        <div className="gas-fee-display">
          <p>Estimated Gas Fee: ${gasFee}</p>
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
