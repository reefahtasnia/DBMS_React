import React, { useState, useEffect } from "react";
import "./CSS/doctorsignup.css";
import backgroundImage from "./CSS/assets/10508261.jpg";
import bangladeshFlag from "./CSS/assets/Bangladesh_flag.png";

const DoctorSignup = () => {
    const [formData, setFormData] = useState({
        regno: "",
        fullname: "",
        gender: "",
        phone: "",
        imagenid: null,
        dept: "",
        mbbsYear: "",
        imagecert1: null,
        hosp: "",
        chamber: "",
      });
      useEffect(() => {
        const initialData = JSON.parse(localStorage.getItem("doctorData"));
        if (initialData) {
          setFormData({ ...formData, ...initialData });
        }
      }, []);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };
    
      const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: files[0],
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting doctor details:", formData);
    
        fetch(`http://localhost:5000/api/doctorSignup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
          console.log("Doctor profile created:", data);
          alert("Doctor profile created successfully!");
          localStorage.removeItem("doctorData"); 
          window.location.href = "/login";
        })
        .catch(error => {
          console.error("Error during doctor signup:", error);
          alert("Failed to create doctor profile");
        });
      };

  return (
    <div
      className="center-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="wrapper">
        <h1>Doctor SIGN UP</h1>
        <form id="doctorSignupForm" onSubmit={handleSubmit}>
          <div className="user-input-box">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Enter your official full name"
              required
            />
          </div>
          <div className="user-input-box">
            <label>Gender</label>
            <div className="gender-options">
              <div className="radio-option">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
          </div>
          <div className="user-input-box">
            <label htmlFor="phone">Phone Number</label>
            <div className="phone-input-container">
              <span className="flag-container">
                <img src={bangladeshFlag} alt="Bangladesh Flag" className="flag-icon" />
              </span>
              <span className="prefix">+880</span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                pattern="[0-9]{10}"
                required
              />
            </div>
          </div>
          <div className="user-input-box">
            <label htmlFor="imagenid">Upload proof of identification (NID / Birth Certificate)</label>
            <input
              type="file"
              id="imagenid"
              name="imagenid"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
          <div className="user-input-box">
            <label htmlFor="dept">Department</label>
            <input
              type="text"
              id="dept"
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              placeholder="Enter your department"
              required
            />
          </div>
          <div className="user-input-box">
            <label htmlFor="regno">BM&DC Full Registration Number</label>
            <input
              type="text"
              id="regno"
              name="regno"
              value={formData.regno}
              onChange={handleChange}
              required
            />
          </div>
          <div className="user-input-box">
            <label htmlFor="mbbsYear">MBBS Complete Year</label>
            <input
              type="text"
              id="mbbsYear"
              name="mbbsYear"
              value={formData.mbbsYear}
              onChange={handleChange}
              placeholder="Enter your MBBS complete year"
              required
            />
          </div>
          <div className="user-input-box">
            <label htmlFor="imagecert1">Upload image of your visiting card</label>
            <p>(If you have one)</p>
            <input
              type="file"
              id="imagecert1"
              name="imagecert1"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div className="user-input-box">
            <label htmlFor="hosp">Name of the hospital currently employed/working in</label>
            <input
              type="text"
              id="hosp"
              name="hosp"
              value={formData.hosp}
              onChange={handleChange}
              required
            />
          </div>
          <div className="user-input-box">
            <label htmlFor="chamber">Name of the clinic/chamber currently practicing in</label>
            <input
              type="text"
              id="chamber"
              name="chamber"
              value={formData.chamber}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn" id="signupbtn" onClick={handleSubmit}>
            Sign Up
          </button>
          <div className="login">
            <p>Already have an account? <a href="/login">Log In</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignup;
