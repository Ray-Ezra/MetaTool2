import React from 'react';
import Table from '../../components/Table/table';

const WelcomePage = () => {

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' }}>
        <h2 style={{ color: 'black', fontSize: '20px', textAlign: 'center', marginTop: '28px' }}>Welcome to Meta Tool {name}</h2>
        <div style={{ maxWidth: '100%', overflowX: 'auto', marginTop: '20px', width: '100%' }}>
          <Table />
        </div>
      </div>
    </>


  );
}

export default WelcomePage;