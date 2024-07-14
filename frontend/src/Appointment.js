import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './appointment.css';
import axios from 'axios';

import searchDoctorImage from './CSS/assets/logo1.png';
import bookAppointmentImage from './CSS/assets/pinkpg2.jpg';
import getWellSoonImage from './CSS/assets/reminders.png';

const Appointment = () => {
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('');

  const handleLocationChange = (e) => {
    const selectedLocation = e.target.value;
    setLocation(selectedLocation);
    console.log('Selected location:', selectedLocation);
  };

  const handleDepartmentChange = (e) => {
    const selectedDepartment = e.target.value;
    setDepartment(selectedDepartment);
    console.log('Selected department:', selectedDepartment);
  };

  const handleSearch = async () => {
    try {
      console.log('Sending search request with:', { location, department });
      const response = await axios.post('http://localhost:5000/api/search-doctors', { location, department });
      console.log(response.data);
      console.log(response.data.length);
      if (response.data.length > 0) {
        window.location.href = '/DoctorResults?location=' + location + '&department=' + department;
        console.log('Doctors found:', response.data);
      } else {
        window.location.href = '/DoctorResults?location=' + location + '&department=' + department + '&error=no-doctors-found. Please try again.';
        //alert('No doctors found for the selected criteria.');
      }
    } catch (error) {
      console.error('Error searching for doctors', error);
    }
  };

  return (
    <div className="appointment-container">
      <div className="find-doctor-section">
        <h2>Find Your Doctor</h2>
        <div className="search-form">
          <select 
            className="form-select"
            value={location}
            onChange={handleLocationChange}
          >
            <option value="">Select Location</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Khulna">Khulna</option>
            <option value="Chittagong">Chittagong</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Mymensingh">Mymensingh</option>
          </select>
          <select 
            className="form-select"
            value={department}
            onChange={handleDepartmentChange}
          >
            <option value="">Select Department</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Gynecology">Gynecology</option>
          </select>
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="how-it-works-section">
        <h2>How it Works</h2>
        <div className="steps">
          <div className="step">
            <img src={searchDoctorImage} alt="Search Doctor" style={{ maxWidth: '250px', height: 'auto' }}/>
            <h3>Search Doctor</h3>
            <p>Find your doctor easily with a minimum of effort. We've kept everything organized for you.</p>
          </div>
          <div className="step">
            <img src={bookAppointmentImage} alt="Book Appointment" style={{ maxWidth: '350px', height: 'auto' }}/>
            <h3>Book Appointment</h3>
            <p>Ask for an appointment with the doctor quickly with almost a single click. We take care of the rest.</p>
          </div>
          <div className="step">
            <img src={getWellSoonImage} alt="Get Well Soon" style={{ maxWidth: '350px', height: 'auto' }}/>
            <h3>Get Well Soon</h3>
            <p>Visit the doctor, take the service based on your appointment. Get back to good health and happiness.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;