import React, { useState, useEffect } from 'react';

const CryptoTable = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);

  // Function to fetch cryptocurrency data from CoinGecko API
  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d'
      );

      if (!response.ok) {
        throw new Error('Failed to fetch cryptocurrency data');
      }

      const data = await response.json();
      setCryptocurrencies(data);
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
    }
  };

  // Use useEffect to fetch data initially and set up interval for periodic updates
  useEffect(() => {
    fetchCryptoData(); // Fetch data initially

    const intervalId = setInterval(() => {
      fetchCryptoData(); // Fetch data periodically (e.g., every 1 minute)
    }, 60000); // Update interval in milliseconds (1 minute)

    return () => {
      clearInterval(intervalId); // Clean up interval on component unmount
    };
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Function to determine trend indicator based on 7-day price change percentage
  const getTrendIndicator = (priceChangePercentage7d) => {
    if (priceChangePercentage7d > 0) {
      return '📈'; // Overall price trend is positive over the past 7 days
    } else if (priceChangePercentage7d < 0) {
      return '📉'; // Overall price trend is negative over the past 7 days
    } else {
      return '—'; // Price trend is neutral (no significant change) over the past 7 days
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price (USD)</th>
            <th>24h Change (%)</th>
            <th>Volume (24h)</th>
            <th>Circulating Supply</th>
            <th>Market Cap (USD)</th>
            <th>Market Dominance (%)</th>
            <th>7d Trend</th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies.map(crypto => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td className={crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${crypto.total_volume.toLocaleString()}</td>
              <td>{crypto.circulating_supply ? crypto.circulating_supply.toLocaleString() : 'N/A'} {crypto.symbol.toUpperCase()}</td>
              <td>${crypto.market_cap ? crypto.market_cap.toLocaleString() : 'N/A'}</td>
              <td>{crypto.market_cap_rank}</td>
              <td>{getTrendIndicator(crypto.price_change_percentage_7d)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
