import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form1 = ({ onNextForm }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [classification, setClassification] = useState('');
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  };

  const handleNext = () => {
    const nameRegex = /^[a-zA-Z]{1,10}$/;

    if (!name.match(nameRegex)) {
      toast.error('Invalid Name.', toastOptions);
      return;
    }
    if (!classification) {
      toast.error('Please provide a classification.', toastOptions);
      return;
    }
    if (name && description && classification) {
      const formData = {
        name,
        description,
        classification,
      };

      //console.log('Form1 Data:', formData)
      onNextForm(2, formData);
    } else {
      toast.error('Please fill in all fields.', toastOptions);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <div style={{ backgroundColor: '#F2EEE3', padding: '20px', borderRadius: '10px', color: 'black', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', width: '400px' }}>
        <div className="form1">
          <h2 style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>New Transaction</h2>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <label htmlFor="name" style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold', textAlign: 'left' }}>Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: 'none',
                  borderBottom: '2px solid black',
                  boxSizing: 'border-box',
                  background: 'transparent',
                  outline: 'none',
                  transition: 'border-bottom-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#6B8065';
                  e.target.style.boxShadow = '0 0 10px 3px #6B8065';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid black';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <label htmlFor="classification" style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold', textAlign: 'left' }}>Classification:</label>
              <input
                type="text"
                id="classification"
                name="classification"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: 'none',
                  borderBottom: '2px solid black',
                  boxSizing: 'border-box',
                  background: 'transparent',
                  outline: 'none',
                  transition: 'border-bottom-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#6B8065';
                  e.target.style.boxShadow = '0 0 10px 3px #6B8065';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottom = '2px solid black';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <div style={{ width: '100%', marginBottom: '20px' }}>
              <label htmlFor="description" style={{ marginBottom: '5px', display: 'block', fontWeight: 'bold', textAlign: 'left' }}>Description:</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  border: '2px solid black',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  background: 'transparent',
                  outline: 'none',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6B8065';
                  e.target.style.boxShadow = '0 0 10px 3px #6B8065';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'black';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={handleNext}
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
              Start Transaction
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Form1;
