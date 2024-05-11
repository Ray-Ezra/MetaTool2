import React, { useState } from 'react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
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
        body: JSON.stringify(formData),
      });
      //console.log(formData)
      
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
    <div className='flex justify-center items-center min-h-[92vh] md:min-h-[90vh] bg-[#f2eee3]'>
      <div className='bg-[#f2eee3] md:mx-auto w-full md:w-[481px] px-4 md:px-8 py-6 md:border-2 md:border-[#E7DFCB] rounded-[10px]'>
      <div className='flex items-center gap-x-3'>
          <img className='w-11' src="/directed-logo.svg" alt="DirectEd" />
          <h2 className='font-poppins text-2xl text-[#333333] font-semibold'>DirectEd</h2>
        </div>
        <h2 className='font-poppins font-semibold text-2xl text-[#493E3E] text-left mt-8 md:mt-6'>Create an account</h2>
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

          <button type="submit" className="relative mt-6 h-[50px] bg-[#6B8065] hover:bg-[#5F725A] border-0 w-full rounded-lg px-10 py-3.5 font-poppins text-base text-[#FFFFFF] font-medium">
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Sign Up'
            )}
          </button>

          <div className='text-center text-[#493E3E] font-poppins mt-6'>
            <p className='text-base'>Already have an account? <a className='text-[#6B8065] font-semibold' href="/">Log in</a></p>
          </div>

        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUp;
