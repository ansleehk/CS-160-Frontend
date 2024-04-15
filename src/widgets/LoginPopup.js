import React, { useState } from "react";
import "./LoginPopup.css";

import createAlert from "../utilities/Alert";

const LoginPopup = ({ onClose }) => {

  // State variables
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  // Handles tab change (signin/signup)
  const handleTabChange = (newTab) => {
    setTab(newTab);
  };


  // Handles email input changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };


  // Handles password input changes
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : Login/signup logic
    console.log("Email:", email);
    console.log("Password:", password);
    createAlert("Profiles not yet implemented.");
    // Close the login popup
    // onClose();
  };


  // TODO : Function for help with password retrieval
  const passwordHelp = () => {
    createAlert("Passwords not yet implemented.");
  };

  return (
    <div id="login-popup-overlay">
      <div id="login-popup">

        {/* Close button */}
        <button id="close-button" onClick={onClose}>x</button>

        {/* Login header */}
        <div id="login-header">
          <h2>{tab === "signin" ? "User Login" : "New User"}</h2>
        </div>

        {/* Tabs to switch between signin/signup */}
        <div id="tab-header">
          <span id={tab === "signin" ? "active" : ""}
            onClick={() => handleTabChange("signin")}
          >
            Sign in
          </span>
          <span id={tab === "signup" ? "active" : ""}
            onClick={() => handleTabChange("signup")}
          >
            Sign up
          </span>
        </div>

        {/* Login/Signup form */}
        <div id="login-content">
          <form onSubmit={handleSubmit}>

            {/* Email + Password */}
            <label>Email:</label>
            <input type="email" value={email}
              onChange={handleEmailChange} required />
            <label>Password:</label>
            <input type={showPassword ? "text" : "password"} value={password}
                onChange={handlePasswordChange} required />

            {/* Password options (help, show) */}
            <div id="password-options">
              {tab === "signin" && (
                <span id="password-help" onClick={passwordHelp}>Password help</span>
              )}
              <span id="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* Submit button */}
            <button type="submit">
              {tab === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
