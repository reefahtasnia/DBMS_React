import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './CSS/login.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      console.log(data.message);
      if (response.ok) {
        localStorage.setItem('otp', data.otp); 
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
          console.log('User ID received and stored:', data.userId);
        } else if (data.bmdc) {
          localStorage.setItem('bmdc', data.bmdc);
          console.log('BMDC number received and stored:', data.bmdc);
        }
        navigate('/otp');
      } else {
        console.error('Failed to receive OTP:', data.message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="center-container">
        <div className="wrapper">
          <h1>SEND OTP</h1>
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="input-box">
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn" id="loginbtn">Send OTP</button>
            <div className="signup">
              <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
