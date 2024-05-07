import React, { useState } from 'react';
import { SERVER_URL } from '../../../../constants/index.js';
import axios from 'axios';



const TransactionForm = () => {
  const [txHash, setTxHash] = useState('');
  const [address, setAddress] = useState('');
  const [txFee, setTxFee] = useState(0);

  const handleTxHashChange = (e) => {
    setTxHash(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleTxFeeChange = (e) => {
    setTxFee(e.target.value);
  };

  const handleSubmitData = () => {
    console.log('Sending Data to server')
    e.preventDefault();
const serverUrl = `${SERVER_URL}/api/addDetails`
    const sendData = {
      TxHash: txHash,
      Wallet: address,
      TxFee: txFee
    }
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    axios
    .post(serverUrl, sendData, axiosConfig)
    .then((response) => {
      console.log('Server response:', response.data)
    })
    .catch((error) => {
      console.error('Error sending data to the server:', error)
    });

    // console.log('TxHash:', txHash);
    // console.log('Address:', address);
    // console.log('Transaction Fee:', txFee);
  };

  return (
    <div style={{ padding: '20px', borderRadius: '10px', color: 'black', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center', maxWidth: '400px' }}>
      <h2 style={{ marginBottom: '20px' }}>Transaction Details</h2>
      <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label htmlFor="txHash" style={{ marginBottom: '5px', display: 'block', textAlign: 'left' }}>TxHash:</label>
          <input
            type="text"
            id="txHash"
            value={txHash}
            onChange={handleTxHashChange}
            style={{ width: '90%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label htmlFor="address" style={{ marginBottom: '5px', display: 'block', textAlign: 'left' }}>Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleAddressChange}
            style={{ width: '90%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '15px', width: '100%' }}>
          <label htmlFor="txFee" style={{ marginBottom: '5px', display: 'block', textAlign: 'left' }}>Transaction Fee:</label>
          <input
            type="number"
            id="txFee"
            value={txFee}
            onChange={handleTxFeeChange}
            style={{ width: '90%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
        </div>
        <button onClick={handleSubmitData} style={{ backgroundColor: '#6B8065', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>Submit</button>
      </form>
    </div>
  );
};

export default TransactionForm;
