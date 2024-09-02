import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './CSS/login.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const bmdc = localStorage.getItem('bmdc');

      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, userId, bmdc }) 
      });

      const data = await response.json();
      if (response.ok) {
        alert('Password reset successfully!');
        navigate('/login'); // Navigate to login after successful password reset
      } else {
        console.error('Failed to reset password:', data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during password reset:', error.message);
    }
  };

  return (
    <div>
      <div className="center-container">
        <div className="wrapper">
          <h1>Reset Password</h1>
          <form id="resetPasswordForm" onSubmit={handleSubmit}>
            <div className="input-box">
              <input 
                type="password" 
                id="password" 
                placeholder="Enter new password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="input-box">
              <input 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirm new password" 
                required 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn" id="resetPasswordBtn">Ok</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
