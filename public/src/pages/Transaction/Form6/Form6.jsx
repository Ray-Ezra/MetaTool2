import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Form6 = ({ formData }) => {
  const [txHash, setTxHash] = useState('');
  const [address, setAddress] = useState('');
  const [txFee, setTxFee] = useState(0);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const formDataFromForm4 = JSON.parse(localStorage.getItem('formDataFromForm4'));

  const handleTxHashChange = (e) => {
    setTxHash(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleTxFeeChange = (e) => {
    setTxFee(e.target.value);
  };

  const handleSubmitData = (e) => {
    e.preventDefault();
    const serverUrl = `https://metatool2-2.onrender.com/api/addDetails`;
    const sendData = {
      localCurrencyName: formDataFromForm4.form5Data.csvDetails.currencyName,
      localCurrencyAmount: formDataFromForm4.form5Data.csvDetails.amount,
      localCurrencyUsdRate: formDataFromForm4.form5Data.csvDetails.rate,
      TXHash: txHash,
      Wallet: address,
      TxFee: txFee,
      TxPerRecipient: txFee / formDataFromForm4.form5Data.recipients.length
    };
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
    axios
      .post(serverUrl, sendData, axiosConfig)
      .then((response) => {
        console.log('Server response:', response.data);
        navigate('/downloadcsv');
      })
      .catch((error) => {
        console.error('Error sending data to the server:', error);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <div style={{ backgroundColor: '#F2EEE3', padding: '20px', borderRadius: '10px', color: 'black', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', width: '400px' }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Transaction Details</h2>
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <label htmlFor="txHash" style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold', textAlign: 'left' }}>TxHash:</label>
            <input
              type="text"
              id="txHash"
              value={txHash}
              onChange={handleTxHashChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                borderBottom: '2px solid black',
                boxSizing: 'border-box',
                background: 'transparent',
                outline: 'none',
                transition: 'border-bottom-color 0.3s, box-shadow 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#6B8065';
                e.target.style.boxShadow = '0 0 10px 3px #6B8065';
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = '2px solid black';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <label htmlFor="address" style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold', textAlign: 'left' }}>Address:</label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                borderBottom: '2px solid black',
                boxSizing: 'border-box',
                background: 'transparent',
                outline: 'none',
                transition: 'border-bottom-color 0.3s, box-shadow 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#6B8065';
                e.target.style.boxShadow = '0 0 10px 3px #6B8065';
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = '2px solid black';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <label htmlFor="txFee" style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold', textAlign: 'left' }}>Transaction Fee:</label>
            <input
              type="number"
              id="txFee"
              value={txFee}
              onChange={handleTxFeeChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                border: 'none',
                borderBottom: '2px solid black',
                boxSizing: 'border-box',
                background: 'transparent',
                outline: 'none',
                transition: 'border-bottom-color 0.3s, box-shadow 0.3s',
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#6B8065';
                e.target.style.boxShadow = '0 0 10px 3px #6B8065';
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = '2px solid black';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button
            onClick={handleSubmitData}
            style={{
              backgroundColor: '#6B8065',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease, transform 0.1s ease', // Added transform transition
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Added boxShadow for the pop effect
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} // Increase scale on hover
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'} // Reset scale when not hovered
            onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} // Decrease scale when clicked
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'} // Reset scale when click released
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form6;
