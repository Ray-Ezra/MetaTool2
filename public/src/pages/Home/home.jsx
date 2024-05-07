import React from 'react';
import Table from '../../components/Table/table';
// import placeholderImage from '../../assets/placeholder.png'; // Import your placeholder image

const WelcomePage = () => {
  // Sample data for recent transactions (replace with actual data)

  // Function to handle scrolling to the recent transactions section
  // const scrollToRecentTransactions = () => {
  //   const recentTransactionsSection = document.getElementById('recentTransactions');
  //   if (recentTransactionsSection) {
  //     window.scrollTo({
  //       top: recentTransactionsSection.offsetTop,
  //       behavior: 'smooth'  // Smooth scrolling animation
  //     });
  //   }
  // };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h2 style={{ color: 'black', fontSize: '24px', textAlign: 'center', marginTop: '20px' }}>Welcome to Meta Tool</h2>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px', width: '100%' }}>

        {/* Left Column - Crypto Flow */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '10px' }}>Crypto Flow</h3>
          <p style={{ color: '#666' }}>Supported by CoinGecko API</p>
          <p style={{ color: '#666' }}>JSON Representation:</p>
          <div style={{ backgroundColor: '#2d2d2d', color: '#ffffff', padding: '10px', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}>
            <code>
              {`{
  "crypto": true,
  "amount": 0.005,
  "currency": "BTC"
}`}
            </code>
          </div>
        </div>

        {/* Right Column - Local Currency Flow */}
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ color: '#333', fontSize: '18px', marginBottom: '10px' }}>Local Currency Flow</h3>
          <p style={{ color: '#666' }}>Supported by Exchange rate API</p>
          <p style={{ color: '#666' }}>JSON Representation:</p>
          <div style={{ backgroundColor: '#2d2d2d', color: '#ffffff', padding: '10px', borderRadius: '4px', fontSize: '14px', fontFamily: 'monospace' }}>
            <code>
              {`{
  "currency": "USD",
  "amount": 50
}`}
            </code>
          </div>
        </div>

      </div>

      {/* Additional Features */}
      <div style={{ marginTop: '40px', textAlign: 'center', width: '100%', color: 'black' }}>
        <h3 style={{ color: '#333', fontSize: '18px' }}>Additional Features</h3>
        <ul style={{ listStyleType: 'none', padding: '0', marginTop: '10px', fontSize: '16px' }}>
          <li>API Integration - Connects seamlessly with CoinGecko and Exchange rate API.</li>
          <li>JSON Representation - Easily view and manipulate data in JSON format.</li>
          <li>CSV Export for Bookkeeping - Export data to CSV for efficient bookkeeping.</li>
          <li>Brief Descriptions - Provides clear insights into supported flows and functionalities.</li>
        </ul>
      </div>

      {/* Scroll to Recent Transactions Button */}
      {/* <button
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: 'transparent',
          color: 'black',
          border: '2px solid #007bff',  // Solid border with blue color
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '24px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',  // Center horizontally
          alignItems: 'center'       // Center vertically
        }}
        onClick={scrollToRecentTransactions}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </button> */}

      {/* Recent Transactions Section */}
      <div id="recentTransactions" style={{ marginTop: '40px', width: '100%' }}>
        <h3 style={{ color: '#333', fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>Recent Transactions</h3>
        <Table
        />
      </div>

    </div>
  );
}

export default WelcomePage;
