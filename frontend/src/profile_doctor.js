import React, { useEffect, useState } from "react";
import "./CSS/userprofile.css";

const DoctorProfile = () => {
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dept, setDept] = useState("");
  const [mbbsYear, setMBBSyear] = useState("");
  const [pracChamber, setPracChamber] = useState("");
  const [hosp, setHosp] = useState("");
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };
  const capitalizeWords = (string) => {
    return string.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };  
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth && auth.BMDC) {
      const url = `http://localhost:5000/api/doctoruser?BMDC=${auth.BMDC}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Fetched data:", data);  // Log the fetched data
          setFullName(capitalizeWords(data[1] || ""));
          setEmail(capitalizeWords(data[2] || ""));
          setPhone(data[4] || "");  // Phone numbers typically do not need capitalization
          setDept(capitalizeWords(data[5] || ""));
          setMBBSyear(data[6] || "");  // Assuming MBBS year does not need capitalization
          setPracChamber(capitalizeWords(data[8] || ""));
          setHosp(capitalizeWords(data[7] || ""));
          setProfileImage(data.profileImage || "https://via.placeholder.com/150");
        })
        .catch(error => {
          console.error("Failed to fetch doctor data:", error);
          alert(`Failed to load doctor data: ${error.message}`);
        });
    }
  }, []);
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    if (auth && auth.BMDC) {
      const updatedDoctor = {
        BMDC: auth.BMDC,
        fullname: fullName,
        email: email,
        phone: phone,
        dept: dept,
        mbbsYear: mbbsYear,
        hosp: hosp,
        chamber: pracChamber
      };
  
      console.log("Saving updated doctor data:", updatedDoctor);
  
      fetch(`http://localhost:5000/api/doctor/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedDoctor)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Response not OK');
        }
        return response.json();
      })
      .then(data => {
        console.log("Update response data:", data);
        alert("Profile updated successfully");
      })
      .catch(error => {
        console.error("Error:", error);
        alert("An error occurred during profile update");
      });
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              id="profileImage"
              className="profile-image"
              src={profileImage}
              alt="User Avatar"
            />
            <button
              type="button"
              onClick={triggerFileInput}
              className="profile-image-upload-button"
            >
              <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <input
              type="file"
              id="fileInput"
              className="input-hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{fullName || "John Doe"}</h2>
            <p className="profile-email">{email || "johndoe@gmail.com"}</p>
          </div>
        </div>
        <div className="profile-details">
          <h3 className="profile-section-title">Doctor Profile Details</h3>
          <div className="profile-details-grid">
            <div className="profile-detail">
              <label className="profile-detail-label">Full Name</label>
              <input
                type="text"
                className="profile-detail-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Email</label>
              <input
                type="email"
                className="profile-detail-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Department</label>
              <input
                type="text"
                className="profile-detail-input"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">MBBS Completion Year</label>
              <input
                type="text"
                className="profile-detail-input"
                value={mbbsYear}
                onChange={(e) => setMBBSyear(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Phone Number</label>
              <input
                type="tel"
                className="profile-detail-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Current Hospital</label>
              <input
                type="text"
                className="profile-detail-input"
                value={hosp}
                onChange={(e) => setHosp(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Practicing Chamber</label>
              <input
                type="text"
                className="profile-detail-input"
                value={pracChamber}
                onChange={(e) => setpracChamber(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Current Patients</h3>
          <button className="profile-section-button">Edit</button>
          <div className="profile-section-content">
            <p>Currently empty.</p>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Upcoming Appointments</h3>
          <button className="profile-section-button">Add</button>
          <div className="profile-section-content">
            <p>No upcoming appointments.</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-action-button delete-button">
            Delete Account
          </button>
          <button className="profile-action-button save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
