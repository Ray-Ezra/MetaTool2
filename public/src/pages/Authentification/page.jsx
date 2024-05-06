import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import VerificationAccount from '../test/ver'; // Import the VerificationAccount component

function LoginForm() {
  const navigate = useNavigate();

  // State variables
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otp, setOtp] = useState('');
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  };

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  // Handle OTP generation and display OTP verification overlay
  const handleGenerateOTP = async () => {
    const { email } = formData;

    if (!email) {
      toast.error('Please provide your email to generate OTP', toastOptions);
      return;
    }

    try {
      // Simulate OTP generation logic (replace with actual server call)
      const response = await fetch(`${SERVER_URL}/auth/generateOTP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const { otp } = await response.json();
        setOtp(otp);
        setOtpGenerated(true);
      } else {
        toast.error('Failed to generate OTP. Please try again.', toastOptions);
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      toast.error('Failed to generate OTP. Please try again.', toastOptions);
    }
  };

  // Handle successful OTP verification (called from VerificationAccount component)
  const handleOTPVerificationSuccess = () => {
    navigate('/home'); // Redirect to home page after successful OTP verification
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <div style={{ backgroundColor: '#f2eee3', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', width: '400px', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'black', fontWeight: '600', textAlign: 'left' }}>Login</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Email input */}
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
              }}
            />
          </div>

          {/* Password input with toggle visibility */}
          <div style={{ marginBottom: '10px' }}>
            <label htmlFor="password" style={{ display: 'block', color: 'black', fontWeight: '500' }}>Password:</label>
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
                borderBottom: '2px solid black', 
                borderRadius: '0px',
                boxSizing: 'border-box',
                background: 'transparent',
                transition: 'border-color 0.3s, box-shadow 0.3s', 
                outline: 'none',
              }}
            />
            <span onClick={handleTogglePassword} style={{ cursor: 'pointer', color: 'black' }}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Generate OTP Button */}
          <button type="button" onClick={handleGenerateOTP} style={{ marginBottom: '10px' }}>
            Generate OTP
          </button>

          {/* OTP Verification Overlay */}
          {otpGenerated && (
            <VerificationAccount
              email={formData.email}
              otp={otp}
              onClose={() => setOtpGenerated(false)}
              onSuccess={handleOTPVerificationSuccess}
            />
          )}

          {/* Login Button */}
          <button type="submit" className="login-button">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default LoginForm;
