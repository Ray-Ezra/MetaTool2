import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

const AddToken = ({ isOpen, onClose, onSubmit }) => {
  const [tokens, setTokens] = useState([{ name: '', amount: '', selectedToken: null, selectedCurrency: null, NCA: false, stablecoin: false }]);
  const [tokenOptions, setTokenOptions] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [currencyOptions, setCurrencyOptions] = useState([]);

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
          label: `${currency} - Rate: ${rate.toFixed(4)}`,
          rate: rate
        }));

        setCurrencyOptions(options);
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleAddToken = () => {
    if (tokens.length < 5) {
      const newToken = { name: '', amount: '', selectedToken: null, selectedCurrency: null, NCA: false, stablecoin: false };
      setTokens([...tokens, newToken]);
    }
  };

  const handleRemoveToken = (index) => {
    const updatedTokens = [...tokens];
    updatedTokens.splice(index, 1);
    setTokens(updatedTokens);
  };

  const handleTokenChange = (selectedOption, index) => {
    const updatedTokens = [...tokens];
    updatedTokens[index].selectedToken = selectedOption;
    updatedTokens[index].name = selectedOption.value;
    setTokens(updatedTokens);
  };

  const handleAmountChange = (index, amount) => {
    const updatedTokens = [...tokens];
    updatedTokens[index].amount = amount;
    setTokens(updatedTokens);
  };

  // Inside handleCurrencyChange function

const handleCurrencyChange = async (selectedOption, index) => {
  const selectedCurrency = selectedOption.value;
  const selectedRate = selectedOption.rate;

  const updatedTokens = [...tokens];
  updatedTokens[index].selectedCurrency = selectedOption;
  setTokens(updatedTokens);

  if (updatedTokens[index].selectedToken && updatedTokens[index].selectedToken.value) {
    const selectedTokenId = updatedTokens[index].selectedToken.value;
    const cryptoConversionRate = exchangeRates[selectedTokenId].usd;

    const cryptoAmount = parseFloat(updatedTokens[index].amount || 0);
    const cryptoAmountInUSD = cryptoAmount * cryptoConversionRate;

    const finalAmountInCurrency = cryptoAmountInUSD * selectedRate;
     const selectedRateUSD = 1 / selectedRate;
    const cryptoData = {
      token: selectedTokenId,
      amount: cryptoAmount,
      amountUSD: cryptoAmountInUSD,
      finalCurrencyAmount: finalAmountInCurrency,
      finalCurrencyName: selectedCurrency,
      cryptoConversionRate: cryptoConversionRate,
      currencyConversionRate: selectedRate,
      currencyConversionRateUSD: selectedRateUSD,
    };
    localStorage.setItem('cryptoData', JSON.stringify(cryptoData));
    console.log(`Token ${index + 1} calculations:`, cryptoData);
  }
};


  const handleSubmit = () => {
    onSubmit(tokens);
    onClose();
  };

  return (
    <div className="overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#f2eee3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="overlay-content" style={{ backgroundColor: '#f2eee3', color: 'black', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', maxWidth: '400px', width: '100%' }}>
        <h2>Add Tokens</h2>
        {tokens.map((token, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <Select
              options={tokenOptions}
              value={token.selectedToken}
              onChange={(selectedOption) => handleTokenChange(selectedOption, index)}
              placeholder="Search or Select Token"
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
              value={token.amount}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              placeholder="Amount"
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
            <Select
              options={currencyOptions}
              value={token.selectedCurrency}
              onChange={(selectedOption) => handleCurrencyChange(selectedOption, index)}
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
              }}            />
          </div>
        ))}
        <button onClick={() => handleRemoveToken(index)} style={{ marginLeft: '10px', padding: '8px 12px', borderRadius: '4px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}>Remove</button>
        <button onClick={handleAddToken} style={{ marginBottom: '10px', padding: '8px 12px', borderRadius: '4px', backgroundColor: '#4caf50', color: '#fff', border: 'none', cursor: 'pointer' }}>Add Token</button>
        <button onClick={handleSubmit} style={{ padding: '8px 12px', borderRadius: '4px', backgroundColor: '#2196f3', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>Submit</button>
      </div>
    </div>
  );
}

export default AddToken;
