import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const CurrencyConverter = ({ onClose, onSubmit }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [amount, setAmount] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [tokenOptions, setTokenOptions] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState('');

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'bitcoin,ethereum,usd-coin,cardano,polkadot,ripple,litecoin,chainlink,stellar,filecoin,tron,tezos,eos,monero,neo,cosmos,vechain,aave,dogecoin,uniswap,theta,fantom,yearn-finance,maker,compound,algorand,ethereum-classic,bitshares,uma,hedera-hashgraph,zcash,elrond,nem,decred,sushiswap,terra-luna,the-graph,pancakeswap,cdai,axie-infinity,loopring,bittorrent-2,trust-wallet-token,huobi-token',
            vs_currencies: 'usd',
          },
        });

        const exchangeRatesData = response.data;
        setExchangeRates(exchangeRatesData);

        const tokenInfoResponse = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        const tokenInfo = tokenInfoResponse.data.reduce((acc, token) => {
          acc[token.id] = token;
          return acc;
        }, {});

        const options = Object.keys(exchangeRatesData).map(tokenId => {
          const token = tokenInfo[tokenId];
          const isStablecoin = token && token.categories && token.categories.includes('Stablecoins');

          return {
            value: tokenId,
            label: `${tokenId} - Price: $${exchangeRatesData[tokenId].usd} - ${isStablecoin ? 'Stablecoin' : 'Native cryptocurrency'}`,
          };
        });

        setTokenOptions(options);
      } catch (error) {
        console.error('Error fetching token exchange rates:', error);
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://v6.exchangerate-api.com/v6/739224dbb2df4339cc564344/latest/USD');
        const rates = response.data.conversion_rates;
        const options = Object.entries(rates).map(([currency, rate]) => ({
          value: currency,
          label: currency,
          rate: rate
        }));
        setCurrencyOptions(options);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleCurrencyChange = (selectedOption) => {
    setSelectedCurrency(selectedOption);
    setConversionResult(null); // Reset conversion result when currency changes
  };

  const handleAmountChange = (event) => {
    const inputAmount = parseFloat(event.target.value);
    setAmount(isNaN(inputAmount) ? '' : inputAmount);
    setConversionResult(null); // Reset conversion result when amount changes
  };

  const convertCurrency = () => {
    if (selectedCurrency && amount) {
      const rate = selectedCurrency.rate;
      const usdAmount = amount / rate;
      setConversionResult(usdAmount.toFixed(2)); // Display the converted amount in USD
    }
  };

  const handleTokenChange = (selectedOption) => {
    setSelectedToken(selectedOption);
    setConvertedAmount(null); // Reset converted amount when token changes
  };

  const convertToCryptocurrency = () => {
    if (selectedToken && conversionResult) {
      const cryptoConversionRate = exchangeRates[selectedToken.value].usd;
      const finalAmountInCrypto = conversionResult * cryptoConversionRate;
      setConvertedAmount(finalAmountInCrypto.toFixed(6)); // Display the converted amount in selected cryptocurrency
    }
  };

  const handleSubmit = () => {
    if (convertedAmount) {
      const formData = {
        currencyName: selectedCurrency.value,
        amount: amount,
        amountUSD: conversionResult,
        selectedCryptocurrency: selectedToken.value,
        amountCrypto: convertedAmount
      };
      onSubmit(formData); // Pass CSV details to the onSubmit function
      localStorage.setItem('cryptoData', JSON.stringify(formData)); // Store data in local storage
      console.log(formData)
      onClose(); // Close the overlay
    }
  };

  return (
    <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#f2eee3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="payment-form" style={{ backgroundColor: '#F2EEE3', padding: '20px', borderRadius: '10px', color: 'black', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', width: '80%', maxWidth: '400px' }}>
        <h2>Currency Converter</h2>
        <div>
          <Select
            options={currencyOptions}
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            placeholder="Select Currency"
            styles={{
              control: (provided, state) => ({
                ...provided,
                width: '100%',
                padding: '8px',
                marginTop: '10px',
                borderRadius: '4px',
                border: '1px solid black',
                backgroundColor: 'transparent',
                transition: 'border-color 0.3s, box-shadow 0.3s', // Add transition for smooth color change and box shadow
                outline: 'none', // Remove default focus outline
                boxShadow: state.isFocused ? '0 0 10px 3px #6B8065' : 'none', // Add box shadow on focus
              }),
              placeholder: (provided, state) => ({
                ...provided,
                color: state.isFocused ? '#6B8065' : '#aaa', // Change placeholder color on focus
              }),
            }}
          />
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter Amount"
            style={{
              width: '95%',
              padding: '8px',
              marginTop: '10px',
              borderRadius: '4px',
              border: '1px solid black',
              backgroundColor: 'transparent',
              transition: 'border-color 0.3s, box-shadow 0.3s', // Add transition for smooth color change and box shadow
              outline: 'none', // Remove default focus outline
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6B8065'; // Change border color on focus
              e.target.style.boxShadow = '0 0 10px 3px #6B8065'; // Add box shadow on focus
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#ccc'; // Reset border color on blur
              e.target.style.boxShadow = 'none'; // Remove box shadow on blur
            }}
          />
          <button onClick={convertCurrency} style={{
            marginBottom: '10px',
            marginTop: '10px',
            padding: '8px 12px',
            borderRadius: '4px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}>Convert</button>
          {conversionResult && (
            <div>
              <p>Converted Amount in USD: ${conversionResult}</p>
              <Select
                options={tokenOptions}
                value={selectedToken}
                onChange={handleTokenChange}
                placeholder="Select Cryptocurrency"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    width: '100%',
                    padding: '8px',
                    marginTop: '10px',
                    borderRadius: '4px',
                    border: '1px solid black',
                    backgroundColor: 'transparent',
                    transition: 'border-color 0.3s, box-shadow 0.3s', // Add transition for smooth color change and box shadow
                    outline: 'none', // Remove default focus outline
                    boxShadow: state.isFocused ? '0 0 10px 3px #6B8065' : 'none', // Add box shadow on focus
                  }),
                  placeholder: (provided, state) => ({
                    ...provided,
                    color: state.isFocused ? '#6B8065' : '#aaa', // Change placeholder color on focus
                  }),
                }}
              />
              <button onClick={convertToCryptocurrency}
                style={{
                  marginBottom: '10px',
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                Convert to Cryptocurrency</button>
            </div>
          )}
          {convertedAmount && <button onClick={handleSubmit}
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
          Submit</button>}
        </div>
        {convertedAmount && (
          <div>
            <p>Converted Amount in Selected Cryptocurrency: {convertedAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrencyConverter;
