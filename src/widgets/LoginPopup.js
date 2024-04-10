import React, { useState } from "react";
import "./LoginPopup.css";

import createAlert from "../utilities/Alert";

const LoginPopup = ({ onClose }) => {
  const [tab, setTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login or signup logic here
    // For demonstration purposes, we're just logging the input values
    console.log("Email:", email);
    console.log("Password:", password);
    createAlert("Profiles not yet implemented.");
    // Close the login popup
    //onClose();
  };

  const passwordHelp = () => {
    createAlert("Passwords not yet implemented.");
  };

  return (
    <div id="login-popup-overlay">
      <div id="login-popup">
        <button id="close-button" onClick={onClose}>x</button>
        <div id="login-header">
          <h2>{tab === "signin" ? "User Login" : "New User"}</h2>
        </div>
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
        <div id="login-content">
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input type="email" value={email}
              onChange={handleEmailChange} required />
            <label>Password:</label>
            <input type={showPassword ? "text" : "password"} value={password}
                onChange={handlePasswordChange} required />
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
