import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../constants/index.js';
import { useAppContext } from '../../components/Context/AppProvider.jsx';
import { useTokenContext } from '../../../constants/TokenContext';
import SuccessPage from './Success/Success.jsx';

const Form4 = ({ formData }) => {
  const { updateTransactions } = useAppContext();
  const [successData, setSuccessData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setTokens } = useTokenContext();
  const token = localStorage.getItem('token');
  console.log('Data:', formData)
  localStorage.setItem('formDataFromForm4', JSON.stringify(formData))
  console.log(FormData)

  const handleSendData = () => {
    const serverUrl = `${SERVER_URL}/api/addRecipientTransaction`;

    const exchangeData = formData.form4Data.recipients
    ? formData.form4Data.recipients.flatMap(recipient => {
        const cryptoData = recipient.cryptoData;
        return cryptoData.map(data => ({
          base_currency: data.token,
          quote_currency: 'USD', // Assuming quote currency is USD
          rate: data.cryptoConversionRate,
          time: new Date().toISOString(), // Assuming current time
          stablecoin: data.stablecoin, // You need to define where this comes from
          NCA: data.NCA // You need to define where this comes from
        }));
      })
    : [];
  

    const recipientsData = formData.form4Data.recipients.map((recipient, index) => ({
      name: recipient.name,
      org: recipient.organization,
      wallet: recipient.wallet,
      comment: recipient.comment,
      token1: recipient.selectedTokens[0].name,
      amount1: recipient.selectedTokens[0].amount,
      token2: recipient.selectedTokens.length > 1 ? recipient.selectedTokens[1].name : undefined,
      amount2: recipient.selectedTokens.length > 1 ? recipient.selectedTokens[1].amount : undefined
      // token3:,
      // amount3:,
    }));



    const requestData = {
      transactionName: formData.form2Data.name,
      transactionDescription: formData.form2Data.description,
      recipients: recipientsData,
      tokenName: formData.form4Data.tokens.map((token) => ({
        name: token.name,
        amount: token.amount,
      })),
      // amount: formData.form5Data.amount,
      classificationName: formData.form2Data.classification,
      descriptionName: formData.form2Data.description,
      // exchangeRates:formData.form4Data.exchangeRates,
      exchangeRates: exchangeData,
    };

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .post(serverUrl, requestData, axiosConfig)
      .then((response) => {
        updateTransactions(response.data.recipientData);
        setIsSuccess(true);
        setTokens([{ name: '', amount: 0 }]);
      })
      .catch((error) => {
        console.error('Error sending data to the server:', error);
        setIsSuccess(false);
      });
  };

  return (
    <div style={{ backgroundColor: '#f2eee3', padding: '20px', borderRadius: '10px', color: 'black', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center', maxWidth: '800px', width: '140%', maxHeight: '600px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Transaction Details</h2>
      <hr style={{  margin: 'auto', marginBottom: '20px' }} />
      <form className="summarized" style={{ textAlign: 'left' }}>
        <div style={{ marginBottom: '15px' }}>
          <p style={{ marginBottom: '5px' }}>Classification: {formData.form2Data.classification}</p>
          <p style={{ marginBottom: '5px' }}>Description: {formData.form2Data.description}</p>
        </div>
      </form>
      <button onClick={handleSendData}
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
        Start Transaction
      </button>
      {isSuccess && <SuccessPage successData={successData} />}
    </div>
  );

};

export default Form4;

//validation