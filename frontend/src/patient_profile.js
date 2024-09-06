import React, { useEffect, useState } from "react";
import "./CSS/userprofile.css"; // Adjust the path as necessary
import { FaShoppingCart } from "react-icons/fa"; 

const UserProfile = () => {
  const auth = JSON.parse(localStorage.getItem("user"));
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [street, setStreet] = useState("");
  const [region, setRegion] = useState("");
  const [district, setDistrict] = useState("");
  const [country, setCountry] = useState("");
  const capitalizeWords = (string) => {
    return string.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
  };
  useEffect(() => {
    if (auth && auth.userId) {
      const url = `http://localhost:5000/api/user?userId=${auth.userId}`;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched user data:", data);
          localStorage.setItem("userdata", JSON.stringify(data));
          setProfileData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error.message);
          alert(`Failed to load user data: ${error.message}`);
        });
    }
  }, []);

  const setProfileData = (data) => {
    try {
            const address = data[8];
  
      setFullName(capitalizeWords(`${data[1]} ${data[2]}`)); 
      setEmail(data[4].toLowerCase());
      setDob(data[5] ? new Date(data[5]).toISOString().slice(0, 10) : "");
      setPhone(data[7] || "");
      setBloodGroup(data[6] || "");
  
      // Check if the address exists and set each part
      if (address) {
        setStreet(capitalizeWords(address.STREET || ""));
        setRegion(capitalizeWords(address.REGION || ""));
        setDistrict(capitalizeWords(address.DISTRICT || ""));
        setCountry(capitalizeWords(address.COUNTRY || ""));
      }
    } catch (error) {
      console.error("Error setting profile data:", error);
      throw error;
    }
  };
  

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
  
    const nameParts = fullName.trim().split(" ");
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" "); 
  
    const updatedUser = {
      userId: auth.userId,
      firstname, 
      lastname,   
      email,
      dob,
      phone,
      bloodGroup,
      street,
      region,
      district,
      country
    };
  
    console.log("Saving updated user data:", updatedUser);
  
    fetch(`http://localhost:5000/api/user/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Response not OK");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Update response data:", data);
        if (data.success) {
          alert("Profile updated successfully");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during profile update");
      });
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
            <button className="my-cart-button">
              <FaShoppingCart className="cart-icon" />
              My Cart
            </button>
          </div>
        </div>
        <div className="profile-details">
          <h3 className="profile-section-title">Profile Details</h3>
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
              <label className="profile-detail-label">Date of Birth</label>
              <input
                type="date"
                className="profile-detail-input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
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
              <label className="profile-detail-label">Blood Group</label>
              <input
                type="text"
                className="profile-detail-input"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              />
            </div>
            
            <div className="profile-detail">
              <label className="profile-detail-label">
                House No. & Road No.
              </label>
              <input
                type="text"
                className="profile-detail-input"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Area</label>
              <input
                type="text"
                className="profile-detail-input"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">District</label>
              <input
                type="text"
                className="profile-detail-input"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
            <div className="profile-detail">
              <label className="profile-detail-label">Country</label>
              <input
                type="text"
                className="profile-detail-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div> 
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Medicine Reminders</h3>
          <button className="profile-section-button">Edit</button>
          <div className="profile-section-content">
            <p>No upcoming reminders.</p>
          </div>
        </div>
        <div className="profile-section">
          <h3 className="profile-section-title">Calories Intake</h3>
          <button className="profile-section-button">Edit</button>
          <div className="profile-section-content">
            <p>No data entered.</p>
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
        <div className="profile-actions">
          <button className="profile-action-button delete-button">
            Delete Account
          </button>
          <button
            className="profile-action-button save-button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
