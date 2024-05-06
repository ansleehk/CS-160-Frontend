import React, { useState, useEffect } from "react";

import "./Login.css";

import createAlert from "../utilities/Alert";

const Login = ({ onClose }) => {

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


  // Import the captcha
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  // Clean user input 
  // https://stackoverflow.com/questions/24816/escaping-html-strings-with-jquery
  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=]/g, function (s) {
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
  window.handleSubmit = async (token) => {

    // Clean user input
    setEmail(escapeHtml(email));
    setProfile(escapeHtml(profile));
    setPassword(escapeHtml(password));

    // Send to login/signup logic
    const result = (tab === "signin") ? await signIn(email, password, token) : await signUp(email, password, profile, token);

    // Close popup on successful response
    if (result) { onClose(); } 
  };


  // Handles sign in
  // True if successful, false otherwise
  const signIn = async (email, password, token) => {
    try {
      const response = await fetch('https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          captcha: token
        }),

      });

      if (response.ok) {
        const data = await response.json();

        // TODO : more secure storage
        localStorage.setItem('authToken', data.result.token);
        localStorage.setItem('userId', data.result.userId);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('profile', profile);

        createAlert("Successfully logged in!");
        return true;
      } else {
        // Email not found
        if (response.status === 400) {
          createAlert('User not found!');
        // All other errors
        } else {
          createAlert('Internal server error.');
          console.log("Error : ", response.status, response.statusText)
        }
        return false;
      }
    } catch (error) {
      createAlert('Internal server error.');
      console.log("Error : ", error);
      return false;
    }
  }


  // Handles sign up
  // True if successful, false otherwise
  const signUp = async (email, password, profile, token) => {
    try {
      // Register endpoint
      const response = await fetch('https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
            displayName: profile,
            captcha: token
          })
      });
      // Okay
      if (response.ok) {
        const data = await response.json();

        // TODO : more secure storage
        localStorage.setItem('authToken', data.result.token);
        localStorage.setItem('userId', data.result.userId);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('profile', profile);

        createAlert("Registration successful.")
        return true;
      } else {
        // Email in use
        if (response.status === 400) {
          createAlert('A user with this email already exists!');
        // All other errors
        } else {
          createAlert('Internal server error.');
          console.log("Error : ", response.status, response.statusText)
        }
        return false;
      }
    } catch (error) {
      createAlert('Internal server error.');
      console.log("Error : ", error);
      return false;
    }
  }


  // TODO : Function for help with password retrieval
  const passwordHelp = () => {
    createAlert("Passwords help not yet implemented.");
  };

  return (
    <div id="login-popup-overlay">
      <div id="login-popup">

        {/* Close button */}
        <button id="close-button" onClick={onClose}>x</button>

        {/* Login header */}
        <div id="login-header">
          <h2 id="title">{tab === "signin" ? "User Login" : "New User"}</h2>
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
          <form onSubmit={(event) => { event.preventDefault(); }}>

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

            {/* reCAPTCHA and submit button */}
            <button className="g-recaptcha" data-sitekey="6Lddz84pAAAAAOoVxY1bFZUQqaxLb8XCHGeVYSaL" data-callback='handleSubmit'
              data-action='submit'>
              {tab === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
