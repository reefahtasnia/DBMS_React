import React, { useState } from 'react';
import './CSS/userprofile.css'; // Adjust the path as necessary

const UserProfile = () => {
  const auth=localStorage.getItem('user');
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [address, setAddress] = useState('');

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-image-container">
            <img id="profileImage" className="profile-image" src={profileImage} alt="User Avatar" />
            <button type="button" onClick={triggerFileInput} className="profile-image-upload-button">
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input type="file" id="fileInput" className="input-hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{fullName || 'John Doe'}</h2>
            <p className="profile-email">{email || 'johndoe@gmail.com'}</p>
          </div>
        </div>
        <div className="profile-details">
          <h3 className="profile-section-title">Profile Details</h3>
          <div className="profile-details-grid">
            <div className="profile-detail">
              <label className="profile-detail-label">Full Name</label>
              <input type="text" className="profile-detail-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Email</label>
              <input type="email" className="profile-detail-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Date of Birth</label>
              <input type="date" className="profile-detail-input" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Phone Number</label>
              <input type="tel" className="profile-detail-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Blood Group</label>
              <input type="text" className="profile-detail-input" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
            </div>
            <div className="profile-detail profile-detail-full">
              <label className="profile-detail-label">Address</label>
              <textarea className="profile-detail-input" rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Medical History</h3>
          <button className="profile-section-button">Edit</button>
          <div className="profile-section-content">
            <p>No known medical conditions.</p>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Upcoming Appointments</h3>
          <button className="profile-section-button">Add</button>
          <div className="profile-section-content">
            <p>No upcoming appointments.</p>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Medicine Reminders</h3>
          <button className="profile-section-button">Edit</button>
          <div className="profile-section-content">
            <p>No upcoming appointments.</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-action-button delete-button">Delete Account</button>
          <button className="profile-action-button save-button">Save</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
