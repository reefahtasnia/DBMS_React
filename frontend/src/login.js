import React, { useState } from "react";
import "./CSS/login.css";
import backgroundImage from "./CSS/assets/pinkpg2.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Default to "user"

  const handleLogin = (e) => {
    e.preventDefault();
    const endpoint = userType === "doctor" ? "/api/doctorLogin" : "/api/login";

    fetch(`http://localhost:5000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (data.message === "Login successful") {
          alert("Login successful!");
          // Check the type and store appropriate identifier
          if (userType === "doctor") {
            localStorage.setItem(
              "user",
              JSON.stringify({ BMDC: data.BMDC, email })
            );
            window.location.href = "/Doctor"; // Redirect to doctor dashboard
          } else {
            localStorage.setItem(
              "user",
              JSON.stringify({ userId: data.userId, email })
            );
            window.location.href = "/Patient"; // Redirect to patient dashboard
          }
          localStorage.setItem("userType", userType); // Store the user type in local storage
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during login");
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
        <h1>LOG IN</h1>
        <form id="loginForm" onSubmit={handleLogin}>
          <div className="input-box">
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              required
            />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
            />
            <i className="bx bxs-lock-alt"></i>
          </div>
          <div className="dropdown">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          <div className="forgot-pass">
            <a href="forgotPassword.html">Forgot Password?</a>
          </div>
          <button type="submit" className="btn" id="loginbtn">
            Log In
          </button>
          <div className="signup">
            <p>
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
