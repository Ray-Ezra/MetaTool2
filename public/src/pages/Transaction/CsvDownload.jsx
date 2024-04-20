import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../../constants';
import Papa from 'papaparse';
import animationData from '../../../public/load.json';
import { NavLink } from 'react-router-dom';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
};

const CsvDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    downloadCsv();
  }, []);

  async function downloadCsv() {
    try {
      const response = await fetch(`${SERVER_URL}/api/details`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      if (data.success) {
        const csvData = processDataForCsv(data.verifiedData);
        const csvString = Papa.unparse(csvData);

        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'transaction_details.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setLoading(false);
      } else {
        console.error('Could not receive data from database. Please try again', error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An error occurred while downloading CSV.');
      setLoading(false);
    }
  }

  function processDataForCsv(verifiedData) {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  
    const headers = [
      'Date',
      'From wallet',
      'To whom',
      'Local currency',
      'Local amount',
      'Local-USD',
      'USD to be sent',
      'Stablecoin',
      'Stablecoin-USD',
      'USD-Stablecoin',
      'Native Crypto Asset(NCA)',
      'NCA-USD',
      'USD-NCA',
      'Stablecoin sent',
      'NCA sent',
      'Tx fee',
      'Tx fee/tx',
      'Tx fee/tx(USD)',
      'Classification',
      'Tx ID',
    ];
  
    let rows = [];
  
    verifiedData.forEach(item => {
      const hash = item.Hash ? item.Hash.TXHash || '' : '';
      const wallet = item.Hash ? item.Hash.Wallet || '' : '';
      const txFee = item.Fees ? item.Fees.TxFee || '' : '';
      const txFeePerRecipient = item.Fees ? item.Fees.TxPerRecipient || '' : '';
      const recipientsData = item.RecipientData && item.RecipientData.recipients;
  
      item.Currency.forEach(currency => {
        const CurrencyName = currency ? currency.localCurrencyName || '' : '';
        const CurrencyAmount = currency ? currency.localCurrencyAmount || '' : '';
        const currencyUsd = currency ? currency.localCurrencyUsdRate || '' : '';
        const totalUSD = currency ? currency.localCurrencyUsdAmount || '' : '';
  
        recipientsData.forEach(recipient => {
          const recipientName = recipient.name || ''; // Get recipient's name
  
          const exchangeRatesForRecipient = item.RecipientData.exchangeRates.filter(rate => rate.recipien === recipientName);
  
          exchangeRatesForRecipient.forEach(rate => {
            const stablecoin = rate.stablecoin ? rate.base_currency || '' : '';
            const stablecoinUSD = rate.stablecoin ? rate.rate || '' : '';
            const UsdStablecoin = rate.stablecoin ? (1 / parseFloat(rate.rate)).toFixed(4) : '';
            const nca = rate.NCA ? rate.base_currency || '' : '';
            const NcaUsd = rate.NCA ? rate.rate || '' : '';
            const UsdNca = rate.NCA ? (1 / parseFloat(rate.rate)).toFixed(4) : '';
            const TotalSC = stablecoinUSD * totalUSD;
            const TotalNCA = NcaUsd * totalUSD;
            const txFeePerRecipientUsd = txFeePerRecipient * NcaUsd;
  
            const rowData = [
              currentDate,
              wallet,
              recipientName,
              CurrencyName,
              CurrencyAmount,
              currencyUsd,
              totalUSD,
              stablecoin,
              stablecoinUSD,
              UsdStablecoin,
              nca,
              NcaUsd,
              UsdNca,
              TotalSC,
              TotalNCA,
              txFee,
              txFeePerRecipient,
              txFeePerRecipientUsd,
              item.RecipientData.classification.classificationName || '',
              hash,
            ];
  
            rows.push(rowData);
          });
        });
      });
    });
  
    return [headers, ...rows];
  }
  

  // function processDataForCsv(verifiedData) {
  //   const currentDate = new Date().toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //   });

  //   const headers = [
  //     'Date',
  //     'From wallet',
  //     'To whom',
  //     'Local currency',
  //     'Local amount',
  //     'Local-USD',
  //     'USD to be sent',
  //     'Stablecoin',
  //     'Stablecoin-USD',
  //     'USD-Stablecoin',
  //     'Native Crypto Asset(NCA)',
  //     'NCA-USD',
  //     'USD-NCA',
  //     'Stablecoin sent',
  //     'NCA sent',
  //     'Tx fee',
  //     'Tx fee/tx',
  //     'Tx fee/tx(USD)',
  //     'Classification',
  //     'Tx ID',
  //   ];

  //   let rows = [];

  //   verifiedData.forEach(item => {
  //     const hash = item.Hash ? item.Hash.TXHash || '' : '';
  //     const wallet = item.Hash ? item.Hash.Wallet || '' : '';
  //     // const recipientName =   item.RecipientData?.recipients?.[0]?.name || ''// Check if RecipientData and name exist
  //     const txFee = item.Fees ? item.Fees.TxFee || '' : '';
  //     const txFeePerRecipient = item.Fees ? item.Fees.TxPerRecipient || '' : '';
  //     const CurrencyName = item.Currency ? item.Currency.localCurrencyName || '' : ''
  //     const CurrencyAmount = item.Currency ? item.Currency.localCurrencyAmount || '' : '';
  //     const currencyUsd = item.Currency ? item.Currency.localCurrencyUsdRate || '' : ''
  //     const totalUSD = item.Currency ? item.Currency.localCurrencyUsdAmount || '' : ""
  //     const stablecoinExchangeRate = item.RecipientData && item.RecipientData.exchangeRates.find(rate => rate.quote_currency === 'USD' && rate.stablecoin === true);
  //     const ncaExchangeRate = item.RecipientData && item.RecipientData.exchangeRates.find(rate => rate.quote_currency === 'USD' && rate.NCA === true);
  //     const isNCA = ncaExchangeRate && ncaExchangeRate.NCA;
  //     const nca = isNCA ? ncaExchangeRate.base_currency || '' : '';
  //     const NcaUsd = isNCA ? ncaExchangeRate.rate || '' : '';
  //     const UsdNca = isNCA ? (1 / parseFloat(ncaExchangeRate.rate)).toFixed(4) : '';
  //     const classification = item.RecipientData ? item.RecipientData.classification.classificationName || '' : '';
  //     const isStablecoin = stablecoinExchangeRate && stablecoinExchangeRate.stablecoin;
  //     const stablecoin = isStablecoin ? stablecoinExchangeRate.base_currency || '' : ''
  //     const stablecoinUSD = isStablecoin ? stablecoinExchangeRate.rate || '' : '';
  //     const UsdStablecoin = isStablecoin ? (1 / parseFloat(stablecoinExchangeRate.rate)).toFixed(4) : '';
  //     const TotalSC = stablecoinUSD * totalUSD
  //     const TotalNCA = NcaUsd * totalUSD
  //     const txFeePerRecipientUsd = txFeePerRecipient * NcaUsd


  //     const recipientsData = item.RecipientData && item.RecipientData.recipients;
  //     recipientsData.forEach(recipient => {
  //       const rowData = [
  //         currentDate,
  //         wallet,
  //         recipient.name || '', // Use recipient's name if available
  //         CurrencyName,
  //         CurrencyAmount,
  //         currencyUsd,
  //         totalUSD,
  //         stablecoin,
  //         stablecoinUSD,
  //         UsdStablecoin,
  //         nca,
  //         NcaUsd,
  //         UsdNca,
  //         TotalSC,
  //         TotalNCA,
  //         txFee,
  //         txFeePerRecipient,
  //         txFeePerRecipientUsd,
  //         classification,
  //         hash,
  //       ];

  //       rows.push(rowData);
  //     });
  //   });

  //   return [headers, ...rows];

  // }


  const renderProperty = property => {
    if (typeof property === 'object') {
      return JSON.stringify(property);
    }
    return property;
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="Download_container"
        style={{
          padding: '20px',
          color: 'black',
          borderRadius: '10px',
          backgroundColor: '#f2eee3',
          marginTop: '20%',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
          margin: '20% auto',
          maxWidth: '400px', // Reduced width
        }}
      >
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Csv Details</h2>
        {loading ? (
          <Lottie options={defaultOptions} width={50} height={50} />
        ) : (
          <>
            <button
              onClick={downloadCsv}
              className="download-button"
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
              Download CSV file
            </button>
            <NavLink
              to="/home"
              className="homepage-button"
              style={{
                backgroundColor: '#6B8065',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginLeft: '10px',
                transition: 'background-color 0.3s ease, transform 0.1s ease', // Added transform transition
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', // Added boxShadow for the pop effect
                marginTop: '20px', // Added margin top to separate buttons
                textDecoration: 'none', // Remove underline from NavLink
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} // Increase scale on hover
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'} // Reset scale when not hovered
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'} // Decrease scale when clicked
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'} // Reset scale when click released
            >
              Go to Homepage
            </NavLink>

          </>
        )}
      </div>
    </div>
  );
};

export default CsvDetails;
