import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './CSS/login.css';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = (event) => {
    event.preventDefault();
    const storedOtp = localStorage.getItem('otp'); 
    console.log('OTP entered:', otp);

    if (otp === storedOtp) {
      console.log('OTP match found, redirecting...');
      navigate('/reset'); 
    } else {
      console.log('OTP does not match.');
      alert('Incorrect OTP entered. Please try again.');
      setOtp('');
    }
  };


  return (
    <div>
      <div className="center-container">
        <div className="wrapper">
          <h1>ENTER OTP</h1>
          <form id="otp" onSubmit={handleSubmit}>
            <div className="input-box">
              <input 
                type="text" 
                id="otp" 
                placeholder="Enter your OTP" 
                required 
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
              <i className='bx bxs-user'></i>
            </div>
            <button type="submit" className="btn" id="loginbtn">Next</button>
            <div className="signup">
              <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTP;
