import React, { useRef, useEffect, useState } from 'react';

const VerificationAccount = ({ email, otp, onClose, onSuccess }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const codeRefs = useRef([]);

  useEffect(() => {
    if (codeRefs.current[0]) {
      codeRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (e, idx) => {
    const inputValue = e.target.value;

    if (!isNaN(inputValue) && inputValue.length <= 1) {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[idx] = inputValue;
      setVerificationCode(newVerificationCode);

      if (idx < 5 && codeRefs.current[idx + 1]) {
        codeRefs.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      const newVerificationCode = [...verificationCode];
      newVerificationCode[idx] = '';
      setVerificationCode(newVerificationCode);

      if (idx > 0 && codeRefs.current[idx - 1]) {
        codeRefs.current[idx - 1].focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredOTP = verificationCode.join(''); // Concatenate the entered OTP code
    if (enteredOTP === otp) {
      onSuccess(); // Call the onSuccess callback to handle successful verification
    } else {
      alert('Incorrect OTP. Please try again.'); // Display an error message
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        backdropFilter: 'blur(10px)', // Apply blur effect to the background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999, // Ensure the overlay is on top of other content
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '400px',
          textAlign: 'center',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2 style={{ color: '#333' }}>Verify Your Account</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          We emailed you the six-digit code to {email}.
          <br />
          Enter the code below to confirm your email address
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          {verificationCode.map((value, idx) => (
            <input
              key={idx}
              ref={(el) => (codeRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={value}
              className="verification-code"
              placeholder="0"
              onChange={(e) => handleInputChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              style={{
                width: '40px',
                height: '40px',
                fontSize: '24px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                textAlign: 'center',
                marginRight: '8px',
                outline: 'none',
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleVerify}
          style={{
            minWidth: '200px',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#9861c2',
            color: '#fff',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            outline: 'none',
          }}
        >
          Verify
        </button>
        <small style={{ color: '#888', marginTop: '20px', display: 'block' }}>
          If you didn't receive a code! <strong>RESEND</strong>
        </small>
        <button
          type="button"
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#ccc',
            color: '#333',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            outline: 'none',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VerificationAccount;
