import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTokenContext } from '../../../constants/TokenContext';

const Form5 = ({ onNextForm }) => {
  const { tokens } = useTokenContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  const cryptoData = JSON.parse(localStorage.getItem('cryptoData'))
  console.log(cryptoData)
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  useEffect(() => {
    const initialRates = {};
    tokens.forEach(token => {
      // Find the corresponding token in cryptoDat
      const cryptoToken = cryptoData.find(cryptoToken => cryptoToken.Name === token.name);

      // Set NCA and Stablecoin values based on cryptoDat (if found)
      const nca = cryptoToken?.NCA || false; // Use optional chaining for NCA
      const stablecoin = cryptoToken?.Stablecoin || false; // Use optional chaining for Stablecoin

      initialRates[token.name] = [{
        base_currency: token.name,
        quote_currency: 'USD',
        rate: '',
        time: '',
        NCA: nca,
        Stablecoin: stablecoin
      }];
    });
    setExchangeRates(initialRates);
  }, [tokens]);

  const handleNextForm = () => {
    // Proceed to the next form
    if (currentIndex === tokens.length - 1) {

      const areFieldsEmpty = tokens[currentIndex].name in exchangeRates &&
        exchangeRates[tokens[currentIndex].name].some(rate => rate.rate.trim() === '' || rate.time.trim() === '');


      if (Object.values(exchangeRates).every(rates => rates.length > 0)) {

        if (!areFieldsEmpty) {
          const formData = {
            exchangeRates: exchangeRates
          };
          onNextForm(4, formData);
          toast.success('Exchange rates added succesfully!')
        }
      } else {
        toast.error('Please enter exchange rates for all tokens.', toastOptions);
      }
    } else {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevForm = () => {
    // Move to the previous form
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleRateChange = (token, index, field, value) => {
    const updatedRates = { ...exchangeRates };
    updatedRates[token][index][field] = value;
    setExchangeRates(updatedRates);
  };

  return (
    <>
      <h2 style={{ textAlign: 'center', color: 'black' }}>EXCHANGE RATES</h2>
      <div style={{ backgroundColor: '#F2EEE3', padding: '20px', borderRadius: '10px', color: 'black', margin: '2% auto', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', textAlign: 'center', width: '320px' }} className="form5_container">
        <h2 style={{ textAlign: 'center' }}>{tokens[currentIndex].name}</h2>

        {exchangeRates[tokens[currentIndex].name] && exchangeRates[tokens[currentIndex].name].map((rate, index) => (
          <div key={index} style={{ marginTop: '10px' }}>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <label htmlFor="quote_currency" style={{ marginBottom: '5px', display: 'block',marginLeft: '15px', fontWeight: 'bold', textAlign: 'left' }}>Quote Currency</label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  type="text"
                  value={rate.quote_currency}
                  onChange={(e) => handleRateChange(tokens[currentIndex].name, index, 'quote_currency', e.target.value)}
                  style={{
                    width: '90%',
                    padding: '8px',
                    border: 'none', // Remove default border
                    borderBottom: '1px solid black', // Add bottom border
                    boxSizing: 'border-box',
                    background: 'transparent',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#6B8065'; // Change bottom border color on focus
                    e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'black'; // Reset bottom border color on blur
                    e.target.style.boxShadow = 'none'; // Remove box shadow on blur
                  }}
                />

              </div>
            </div>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <label htmlFor="rate" style={{ marginBottom: '5px', display: 'block',marginLeft: '15px', fontWeight: 'bold', textAlign: 'left' }}>Rate</label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  type="text"
                  value={rate.rate}
                  onChange={(e) => handleRateChange(tokens[currentIndex].name, index, 'rate', e.target.value)}
                  style={{
                    width: '90%',
                    padding: '8px',
                    border: 'none', // Remove default border
                    borderBottom: '1px solid black', // Add bottom border
                    boxSizing: 'border-box',
                    background: 'transparent',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#6B8065'; // Change bottom border color on focus
                    e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'black'; // Reset bottom border color on blur
                    e.target.style.boxShadow = 'none'; // Remove box shadow on blur
                  }}
                />

              </div>
            </div>
            <div style={{ textAlign: 'left', marginBottom: '10px' }}>
              <label htmlFor="time" style={{ marginBottom: '5px', display: 'block',marginLeft: '15px', fontWeight: 'bold', textAlign: 'left' }}>Time</label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input
                  type="time"
                  value={rate.time}
                  onChange={(e) => handleRateChange(tokens[currentIndex].name, index, 'time', e.target.value)}
                  style={{
                    width: '90%',
                    padding: '8px',
                    border: 'none', // Remove default border
                    borderBottom: '1px solid black', // Add bottom border
                    boxSizing: 'border-box',
                    background: 'transparent',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderBottomColor = '#6B8065'; // Change bottom border color on focus
                    e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
                  }}
                  onBlur={(e) => {
                    e.target.style.borderBottomColor = 'black'; // Reset bottom border color on blur
                    e.target.style.boxShadow = 'none'; // Remove box shadow on blur
                  }}
                />

              </div>
            </div>
          </div>
        ))}
        <ToastContainer />

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handlePrevForm} disabled={currentIndex === 0} style={{ marginLeft: '10px', padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
            Previous
          </button>
          <button onClick={handleNextForm} className="authentic" style={{ marginLeft: '10px', padding: '10px 20px', border: 'none', borderRadius: '5px', backgroundColor: '#4CAF50', color: 'white', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
            {currentIndex === tokens.length - 1 ? 'Continue' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Form5;