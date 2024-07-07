import React from "react";
import Navbar from "./nav";
import Home from "./Home";
import Signup from "./signup";
import Login from "./login";
import UserProfile from "./patient_profile";
import Appointment from "./Appointment.js";
import DoctorResults from "./DoctorResults.js";
import PrivateComponent from "./PrivateComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateComponent />}>
            <Route path="/Patient" element={<UserProfile />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor" element={<Appointment />} />
          <Route path="/DoctorResults" element={<DoctorResults />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
