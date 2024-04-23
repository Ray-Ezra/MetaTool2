import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../../constants/index.js';
import { useAppContext } from '../../../components/Context/AppProvider.jsx';
import { useTokenContext } from '../../../../constants/TokenContext';
import SuccessPage from '../Success/Success.jsx';
import './Form4.css';

const Form4 = ({ formData, csvDetails }) => {
  //console.log('Received formData:', formData);
  //console.log('Received csvDetails:', csvDetails);

  const { updateTransactions } = useAppContext();
  const [successData, setSuccessData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { setTokens } = useTokenContext();
  const token = localStorage.getItem('token');

  const handleSendData = () => {
    //console.log('Sending data to the server...');
    //console.log('FormData to be sent:', formData); 

    const serverUrl = `${SERVER_URL}/api/addRecipientTransaction`;

    const recipientsData = formData.form3Data.recipients.map((recipient, index) => ({
      name: recipient.name,
      org: recipient.organization,
      wallet: recipient.wallet,
      comment: recipient.comment,
      // Add other properties as needed
    }));

    const requestData = {
      transactionName: formData.form2Data.name,
      transactionDescription: formData.form2Data.description,
      recipients: recipientsData,
      tokenName: formData.form3Data.tokens.map((token) => ({
        name: token.name,
        amount: token.amount,
      })),
      amount: formData.form5Data.amount,
      classificationName: formData.form5Data.classification,
      descriptionName: formData.form5Data.description,
      exchangeRates: formData.form4Data.exchangeRate,
      csvDetails: csvDetails,
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
        //console.log('Server response:', response.data);
        updateTransactions(response.data.recipientData);
        setIsSuccess(true);
        setTokens([{ name: '', amount: 0 }])
      })
      .catch((error) => {
        console.error('Error sending data to the server:', error);
        setIsSuccess(false);
      });
  };

  return (
    <div className="form_container">
      <form className="summarized">
        {/* Render form data */}
      </form>
      <button onClick={handleSendData} className="authentic">
        Save and submit
      </button>
      {isSuccess && <SuccessPage successData={successData} />}
    </div>
  );
};

export default Form4;
