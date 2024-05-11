import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '../../components/Customs/button';
import { NavLink } from 'react-router-dom';
import Title from '../../components/Customs/Title';
import Table from '../../components/Table/table'

const MetadataComponent = () => {
  // Sample metadata (replace with actual metadata)
  const metadata = [
    {
      classification: "Bitcoin transact",
      description: "Stipends",
      exchangeRates: [
        {
          base_currency: "ADA",
          quote_currency: "USD",
          rate: "$$",
          time: "04:13",
          stablecoin: false,
          NCA: false,
          _id: "660dd485fbbdc0440792a6ea"
        }
      ],
      recipients: [
        {
          name: "Raymond Ezra",
          org: "directed",
          wallet: "addr1q9w53pgeylwd4xfwt8fk5at0u",
          token1: "ADA",
          amount1: "12"
        }
      ],
      verified: true,
      createdAt: "2024-04-03T22:13:25.011Z",
      updatedAt: "2024-04-03T22:13:25.011Z"
    }
  ];

  // Extract the first metadata entry (assuming there's only one in the array)
  const entry = metadata[0];

  // Convert metadata to JSON string with proper indentation
  const jsonString = JSON.stringify(entry, null, 2);

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', marginTop: '40px', width: '100%' }}>
      {/* Left Column - Details */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <div style={{ maxWidth: '800px', padding: '20px', borderRadius: '10px' }}>
          <Title>
            Metadata Details
          </Title>
          <p style={{ marginTop: '20px', fontSize: '16px', color: 'black', textShadow: 'unset', fontWeight: 'bold' }}>
            Metadata in transactions provides crucial additional data beyond basic transaction details, enhancing transparency and functionality. This data includes classification, descriptions, and timestamps, allowing for comprehensive record-keeping and analysis.
          </p>
          <NavLink to="/form-display">
            <Button style={{ padding: '10px', borderRadius: '10px', backgroundColor: '#395241', color: '#fff', border: 'none' }}>Generate</Button>
          </NavLink>
        </div>
      </div>

      {/* Right Column - JSON Representation */}
      <div style={{ overflowY: 'auto' }}>
        <SyntaxHighlighter language="json" style={xonokai}>
          {jsonString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

const WelcomePage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      {/* Main Content */}
      <MetadataComponent />

      {/* Recent Transactions Section */}
      <div id="recentTransactions" style={{ marginTop: '40px', width: '100%' }}>
        <h3 style={{ color: '#333', fontSize: '18px', textAlign: 'center', marginBottom: '20px' }}>Recent Transactions</h3>
        <Table />
      </div>
    </div>
  );
}

export default WelcomePage;
