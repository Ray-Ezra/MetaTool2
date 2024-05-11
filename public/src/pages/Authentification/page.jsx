import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../../constants';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
import VerificationAccount from './verify';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [otp, setOtp] = useState('');

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${SERVER_URL}/auth/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const otpResponse = await fetch(`${SERVER_URL}/api/otp/generate-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: formData.email }),
        });

        const otpData = await otpResponse.json();

        if (otpResponse.ok) {
          setOpenVerification(true);
          setOtp(otpData.otp);
        } else {
          toast.error('Failed to generate OTP');
        }
      } else {
        toast.error(data.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  const onSuccessVerification = () => {
    setOpenVerification(false);
    navigate('/home');
  };

  return (
    <div className='flex justify-center items-center min-h-[92vh] md:min-h-[90vh]'>
      <div className='bg-[#f2eee3] md:mx-auto w-full md:w-[480px] px-4 md:px-8 py-6 md:border-2 md:border-[#E7DFCB] rounded-[10px]'>
        <div className='flex items-center gap-x-3'>
          <img className='w-11' src="/directed-logo.svg" alt="DirectEd" />
          <h2 className='font-poppins text-2xl text-[#333333] font-semibold'>DirectEd</h2>
        </div>
        <h2 className='font-poppins font-semibold text-2xl text-[#493E3E] text-left mt-8 md:mt-6'>Log in to your account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className='block mt-6 font-poppins font-medium text-[#493E3E]'>Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className='mt-2 block bg-[#F2EEE3] border-2 border-[#EAE3D2] outline-none w-full rounded-lg px-4 py-3.5 text-base font-poppins text-[#333333] placeholder:text-[#D0C8C8]' placeholder='e.g. johndoe@gmail.com'
            />
          </div>
          <div className='mt-4'>
            <label htmlFor="password" className='block font-poppins mb-2 font-medium text-[#493E3E]'>Password:</label>
          </div>

          <div className='relative'>
            <div className='flex items-center'>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name='password' 
                  id='password' 
                  value={formData.password} 
                  onChange={handleInputChange}
                  required
                  className="font-poppins bg-[#F2EEE3] border-2 border-[#EAE3D2] mx-auto w-full block rounded-lg px-4 py-3.5 text-base text-[#493E3E] outline-none" />
                <button type='button' className='absolute text-base font-montserrat right-2 md:right-0 px-4 py-3' onClick={handleTogglePassword}>{showPassword ? <img src='/eye-open-icon.svg' alt="Eye Open" /> : <img src='/eye-closed-icon.svg' alt="Eye Closed" />}</button>
              </div>
          </div>

          <button type="submit" className="relative h-[50px] mt-6 bg-[#6B8065] hover:bg-[#5F725A] border-0 w-full rounded-lg px-10 py-3.5 font-poppins text-base text-[#FFFFFF] font-medium">
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Login'
            )}
          </button>

          <div className='text-center text-[#493E3E] font-poppins mt-6'>
            <p className='text-base'>Don&apos;t have an account? <a className='text-[#6B8065] font-semibold' href="/signup">Sign up</a></p>
          </div>

        </form>
        <ToastContainer />
        {openVerification && (
          <VerificationAccount
            email={formData.email}
            otp={otp}
            onClose={() => setOpenVerification(false)}
            onSuccess={onSuccessVerification}
          />
        )}
      </div>
    </div>
  );
};

export default LoginForm;

// return (
//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
//     <div style={{ backgroundColor: '#f2eee3', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', width: '400px', padding: '20px', borderRadius: '10px' }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '20px' }}>
//         <img src="/Logo icon 5.png" alt="DirectEd" className="login-icon" width="42px" height="38px" />
//         <h2 style={{ color: 'black', marginLeft: '10px', transform: 'translateY(10%)' }}>DirectEd</h2>
//       </div>
//       <h2 style={{ fontSize: '20px', marginBottom: '20px', color: 'black', fontWeight: '600', textAlign: 'left' }}>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '10px' }}>
//           <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', color: 'black', fontWeight: '500' }}>Email Address:</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               borderBottom: '2px solid black', 
//               borderRadius: '0px',
//               boxSizing: 'border-box',
//               background: 'transparent',
//               transition: 'border-color 0.3s, box-shadow 0.3s', 
//               outline: 'none',
//               borderLeft: 'none', 
//               borderTop: 'none', 
//               borderRight: 'none', 
//             }}
//             onFocus={(e) => {
//               e.target.style.borderBottom = '2px solid #6B8065'; 
//               e.target.style.boxShadow = '0 2px 10px 3px #6B8065';
//             }}
//             onBlur={(e) => {
//               e.target.style.borderBottom = '2px solid black'; 
//               e.target.style.boxShadow = 'none'; 
//             }}
//           />

//         </div>

//         <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
//           <label htmlFor="password" style={{ display: 'block', color: 'black', fontWeight: '500' }}>Password:</label>
//         </div>

//         <div style={{ position: 'relative' }}>
//           <input
//             type={showPassword ? 'text' : 'password'}
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//             style={{
//               width: '100%',
//               padding: '10px',
//               border: 'none',
//               borderBottom: '2px solid black', 
//               borderRadius: '0px',
//               boxSizing: 'border-box',
//               background: 'transparent', 
//               transition: 'border-bottom-color 0.3s',
//               outline: 'none',
//               boxShadow: 'none',
//             }}
//             onFocus={(e) => {
//               e.target.style.borderBottomColor = '#6B8065'; 
//               e.target.style.boxShadow = '0 0 10px 3px #6B8065';
//             }}
//             onBlur={(e) => {
//               e.target.style.borderBottom = '2px solid black'; 
//               e.target.style.boxShadow = 'none'; // Remove glow effect on blur
//             }}
//           />

//           <span
//             onClick={handleTogglePassword}
//             style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', cursor: 'pointer', color: 'black', }}
//             title={showPassword ? 'Hide password' : 'Show password'}
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>

//         <div>
//           <p style={{color:'black'}}>Don't have an account? <a  style={{color:'black', fontWeight:'bold'}} href="/signup">Sign up</a></p>
//         </div>

//         {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
//         <button type="submit" className="login-button">
//           {isLoading ? (
//             <div className="spinner"></div>
//           ) : (
//             'Login'
//           )}
//         </button>
//       </form>
//       <ToastContainer />
//     </div>
//   </div>