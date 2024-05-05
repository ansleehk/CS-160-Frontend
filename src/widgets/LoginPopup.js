import React, { useState } from "react";
import "./LoginPopup.css";

import createAlert from "../utilities/Alert";

const LoginPopup = ({ onClose }) => {

  // State variables
  const [tab, setTab] = useState("signin");
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  

  // Clean user input 
  // https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  }


  // Handles tab change (signin/signup)
  const handleTabChange = (newTab) => {
    setTab(newTab);
  };


  // Handles profile name changes
  const handleProfileChange = (e) => {
    setProfile(e.target.value);
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

    // Clean user input
    setEmail(escapeHtml(email));
    setProfile(escapeHtml(profile));
    setPassword(escapeHtml(password));

    // Send to login/signup logic
    var result = (tab == "signin") ? 
      signIn(email, password) : 
      signUp(email, profile, password);

    // Close popup on successful response
    if (result) { onClose(); }
  };


  // Handles sign in
  // True if successful, false otherwise
  const signIn = (email, password) => {
    createAlert("Profiles not yet implemented.");
  }


  // Handles sign up
  // True if successful, false otherwise
  const signUp = async (email, profile, password) => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('displayName', profile);

    // Register upload endpoint
    const response = await fetch('/auth/register', {
      method: 'POST',
      body: formData
    });

    // Error : Email in use
    if (response.status === 400) {
      createAlert('A user with this email already exists!');
      return false;
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error.');
      throw(Error);
      return false;
    }

    const responseBody = await response.text();
    createAlert("Registration successful.");
    return true;
  }


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

            {tab === "signup" && (
              <>
              <label>Name:</label>
              <input value={profile}
                onChange={handleProfileChange}
                pattern="[A-Za-z0-9]{3,24}"
                title="Name must be an alphanumeric string between 3-24 characters"
                required />
              </>
            )}

            {/* Email + Password */}
            <label>Email:</label>
            <input type="email" value={email}
              onChange={handleEmailChange} required />
            <label>Password:</label>
            <input type={showPassword ? "text" : "password"} value={password}
              onChange={handlePasswordChange} 
              pattern=".{8,}"
              title="Password must be at least 8 characters long"
              required />

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
