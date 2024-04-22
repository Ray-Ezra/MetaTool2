import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { SERVER_URL } from '../../../constants';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  };

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${SERVER_URL}/auth/Register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      // Success
      setErrorMessage('');
      setEmail('');
      setPassword('');
      alert('Sign up successful!'); // You can customize this
      navigate('/')
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <div style={{ backgroundColor: '#f2eee3', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', width: '400px', padding: '20px', borderRadius: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}>
          <img src="/Logo icon 5.png" alt="DirectEd" className="login-icon" width="42px" height="38px" />
          <h2 style={{ color: 'black', marginLeft: '10px', transform: 'translateY(10%)' }}>DirectEd</h2>
        </div>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'black', fontWeight: '600', textAlign: 'left' }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: 'black', fontWeight: '500' }}>Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderBottom: '2px solid black', 
                borderRadius: '0px',
                boxSizing: 'border-box',
                background: 'transparent',
                transition: 'border-color 0.3s, box-shadow 0.3s', 
                outline: 'none',
                borderLeft: 'none', 
                borderTop: 'none', 
                borderRight: 'none', 
              }}
              onFocus={(e) => {
                e.target.style.borderBottom = '2px solid #6B8065'; 
                e.target.style.boxShadow = '0 2px 10px 3px #6B8065';
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = '2px solid black'; 
                e.target.style.boxShadow = 'none'; 
              }}
            />

          </div>

          <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="password" style={{ display: 'block', color: 'black', fontWeight: '500' }}>Password:</label>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: 'none',
                borderBottom: '2px solid black', 
                borderRadius: '0px',
                boxSizing: 'border-box',
                background: 'transparent', 
                transition: 'border-bottom-color 0.3s',
                outline: 'none',
                boxShadow: 'none',
              }}
              onFocus={(e) => {
                e.target.style.borderBottomColor = '#6B8065'; 
                e.target.style.boxShadow = '0 0 10px 3px #6B8065';
              }}
              onBlur={(e) => {
                e.target.style.borderBottom = '2px solid black'; 
                e.target.style.boxShadow = 'none'; // Remove glow effect on blur
              }}
            />

            <span
              onClick={handleTogglePassword}
              style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', color: 'black', }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="login-button">
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUp;
