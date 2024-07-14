import React from "react";
import Navbar from "./nav";
import Home from "./Home";
import Signup from "./signup";
import Login from "./login";
import UserProfile from "./patient_profile";
import PrivateComponent from "./PrivateComponent";
import DoctorSignup from "./doctorsignup.js";
import DoctorProfile from "./profile_doctor.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {<Route path="/" element={<Home />} /> }
          <Route element={<PrivateComponent />}>
            <Route path="/Patient" element={<UserProfile />} />
            
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/DoctorSignup" element={<DoctorSignup />} />
          <Route path="/Doctor" element={<DoctorProfile />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
