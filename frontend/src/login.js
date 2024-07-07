import React from "react";
import "./CSS/login.css";
import backgroundImage from "./CSS/assets/pinkpg2.jpg";
const Login = () => {
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
        <form id="loginForm">
          <div className="input-box">
            <input type="text" id="email" placeholder="email" required />
            <i className="bx bxs-user"></i>
          </div>
          <div className="input-box">
            <input
              type="password"
              id="password"
              placeholder="password"
              required
            />
            <i className="bx bxs-lock-alt"></i>
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
