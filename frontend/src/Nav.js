import React from 'react';
import './nav.css';
import logo from './logo2fotor.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
      <img src={logo} alt="Logo" className="img-fluid logo" />
        <a className="navbar-brand" href="/home">Maternity Maven</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarScroll"
          aria-controls="navbarScroll" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Doctors</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Shop</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Resources</a>
            </li>
          </ul>
          <button className="btn" type="submit" id="loginButton" onClick={() => window.location.href = '/login'}>Log In</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
