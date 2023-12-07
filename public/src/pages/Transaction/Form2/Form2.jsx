import React, { useState } from 'react';
import './Form2.css';

const Form2 = ({ onNextForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');

  const handleNext = () => {
    // Validate fields before moving to the next form
    if (name && email && wallet) {
      onNextForm(3,{name, email, wallet});
    } else {
      alert('Please fill in all fields.');
    }
  };

  //onUpdateData()

  return (
    <div className="form2_container">
      <div className="form2">
        <h2>Recipient Details</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="fixed-width"
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="fixed-width "
            />
          </div>
          <div className="form-group">
            <label htmlFor="wallet">Wallet Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="fixed-width "
            />
          </div>
        </form>
        <button onClick={handleNext} className="authentic">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Form2;
