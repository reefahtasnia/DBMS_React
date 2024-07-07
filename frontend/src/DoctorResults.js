import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './doctorResults.css';

const DoctorResults = () => {
  const [doctors, setDoctors] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const locationParam = queryParams.get('location');
    const departmentParam = queryParams.get('department');
    fetchDoctors(locationParam, departmentParam);
  }, [location]);

  const fetchDoctors = async (location, department) => {
    try {
      const response = await axios.post('http://localhost:5000/api/search-doctors', { location, department });
      console.log('Fetched doctors:', response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors', error);
    }
  };

  return (
    <div className="doctor-results-container">
      <h2>Available Doctors</h2>
      <button className="btn btn-secondary" onClick={() => window.history.back()}>Back</button>
      <div className="doctor-list">
        {/* {doctors.map((doctor, index) => (
          <div key={index} className="doctor-card">
            <img src="CSS/assets/medicine1.jpg" alt={doctor[1]} />
            <h3>{doctor[1]}</h3>
            <p>Department: {doctor[2]}</p>
            <p>Practiced Area: {doctor[3]}</p>
            <p>Gender: {doctor[4]}</p>
          </div>
        ))} */}
        <p>It works</p>
      </div>
    </div>
  );
};

export default DoctorResults;