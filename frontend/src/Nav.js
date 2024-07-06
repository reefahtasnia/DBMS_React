import React from 'react';
import { Link } from 'react-router-dom';
import './nav.css';
import logo from './logo2fotor.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <img src={logo} alt="Logo" className="img-fluid logo" />
        <Link className="navbar-brand" to="/">Maternity Maven</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
          aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/doctors">Doctors</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/shop">Shop</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/resources">Resources</Link>
            </li>
          </ul>
          <button className="btn" type="submit" id="loginButton" onClick={() => window.location.href = '/login'}>Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
