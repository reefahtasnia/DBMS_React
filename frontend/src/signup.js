import React, { useState, useEffect } from "react";
import "./CSS/signup.css";
import backgroundImage from "./CSS/assets/10508261.jpg";

const Signup = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [userType, setUserType] = useState("Select a user account");

  useEffect(() => {
    const auth=localStorage.getItem('user');
    if(auth){
      window.location.href="/";
    }
    const select = document.querySelector(".select");
    const caret = document.querySelector(".caret");
    const menu = document.querySelector(".menu");
    const options = document.querySelectorAll(".menu li");
    const selected = document.querySelector(".selected");
    const signupBtn = document.getElementById("signupbtn");

    const handleOptionSelect = (option) => {
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");

      if (option.classList.contains("user")) {
        signupBtn.innerText = "Sign Up";
        setUserType("user");
      } else if (option.classList.contains("doctor")) {
        signupBtn.innerText = "Next";
        setUserType("doctor");
      }
    };

    select.addEventListener("click", () => {
      select.classList.toggle("select-clicked");
      caret.classList.toggle("caret-rotate");
      menu.classList.toggle("menu-open");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        handleOptionSelect(option);
      });
    });

    return () => {
      select.removeEventListener("click", () => {});
      options.forEach((option) =>
        option.removeEventListener("click", () => {})
      );
    };
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const user = {
      firstname,
      lastname,
      email,
      password,
      dob,
    };

    console.log("Sending signup request:", user);

    fetch(`http://localhost:5000/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    .then(response => {
      // Check if the response is in JSON format
      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        throw new Error('Response not OK');
      } else if (!contentType || !contentType.includes('application/json')) {
        throw new TypeError("Oops, we haven't got JSON!");
      }
      return response.json();
    })
    .then(data => {
      console.log("Signup response data:", data);
      if (data.message === "User created successfully") {
        alert("User created successfully");
        localStorage.setItem("user", JSON.stringify({ userId: data.userId, email }));
        window.location.href = userType === "user" ? "/login" : "/doctorsignup";
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred during signup");
    });
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setDob("");
  };

  return (
    <>
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
          <h1>SIGN UP</h1>
          <form id="signupForm" onSubmit={handleSignup}>
            <div className="main-user-info">
              <div className="user-input-box">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="user-input-box">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              <div className="user-input-box">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="user-input-box">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  name="dob"
                  required
                />
              </div>
              <div className="user-input-box">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  name="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="user-input-box">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <div className="dropdown">
              <div
                className="select"
                onClick={() =>
                  setUserType(
                    userType === "Select a user account"
                      ? "Choose a User account"
                      : "Select a user account"
                  )
                }
              >
                <span className="selected">{userType}</span>
                <div className="caret"></div>
              </div>
              <ul
                className={`menu ${
                  userType === "Select a user account" ? "menu-open" : ""
                }`}
              >
                <li className="user" onClick={() => setUserType("user")}>
                  User
                </li>
                <li className="doctor" onClick={() => setUserType("doctor")}>
                  Doctor
                </li>
              </ul>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="agreecheck"
                required
              />
              <label className="form-check-label" htmlFor="agreecheck">
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="btn" id="signupbtn">
              Next
            </button>
            <div className="login">
              <p>
                Already have an account? <a href="/login">Log In</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
