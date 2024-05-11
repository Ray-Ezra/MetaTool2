import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '../../components/Customs/button';
import { NavLink } from 'react-router-dom';
import Title from '../../components/Customs/Title';
import Table from '../../components/Table/table';

const MetadataComponent = () => {
  const metadata = [
    {
      classification: "Bitcoin transact",
      description: "Stipends",
      exchangeRates: [
        {
          base_currency: "ADA",
          quote_currency: "USD",
          rate: "2.33",
          time: "04:13",
          stablecoin: false,
          NCA: false,
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

    }
  ];

  const entry = metadata[0];

  const jsonString = JSON.stringify(entry, null, 2);

  return (
    <div className="flex w-full flex-col md:flex-row">
      <div className="flex justify-center items-center md:w-2/3 p-4">
        <div>
          <Title>Transaction Metadata Generator</Title>
          <p className="mt-4 text-lg font-bold">
            Seamlessly create JSON and CSV files enriched with metadata for transactional transparency and data management.
          </p>
          <p className="mt-4">
            Metadata in transactions provides crucial additional data beyond basic transaction details, enhancing transparency and functionality. This data includes classification, descriptions, and timestamps, allowing for comprehensive record-keeping and analysis.
          </p>
          <NavLink to="/form-display">
            <Button className="px-4 py-2 mt-5 rounded-lg bg-green-700 text-white">
              Generate Files
            </Button>
          </NavLink>
        </div>
      </div>

      <div className=" h-3/4">
        <SyntaxHighlighter language="json" style={xonokai}>
          {jsonString}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <MetadataComponent />
      <div className="mt-10 w-full">
        <h3 className="text-lg font-semibold text-center mb-4">Recent Transactions</h3>
        <Table />
      </div>
    </div>
  );
}

export default WelcomePage;
