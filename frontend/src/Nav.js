import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./nav.css";
import userIcon from "./CSS/assets/usericon.png";
import logo from "./logo2fotor.png";

const Navbar = () => {
  const auth = localStorage.getItem("user");
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate(auth ? "/Patient" : "/login");
  };

  const logout = () => {
    alert("Logged out successfully");
    localStorage.removeItem('user');
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" className="img-fluid logo" />
          Maternity Maven
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/bookAppointment">
                Doctors
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">
                Shop
              </Link>
            </li>
          </ul>
          <div className="nav-icon-container" onClick={handleIconClick}>
              <img
                src={userIcon}
                alt="User Icon"
                className="nav-user-icon"
              />
            </div>
          <button className="btn" type="button" onClick={handleIconClick}>
            {auth ? "Profile" : "Log In"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
