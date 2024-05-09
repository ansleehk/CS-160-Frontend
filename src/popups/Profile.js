import React, { useState, useEffect } from "react";

import "./Profile.css";

import createAlert from "../utilities/Alert";
import Tooltip from "../utilities/Tooltip";

const Profile = ({ rerender, onClose }) => {

  // State variables
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


  // Stuff to do on load
  useEffect(() => {

    // Get user data from local storage
    // TODO : more secure storage
    setProfile(localStorage.getItem("profile") || "");
    setEmail(localStorage.getItem("email") || "");
    setPassword(localStorage.getItem("password") || "");

    // Import captcha
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


  // Handles account updating
  window.accountUpdate = async (token) => {

    console.log("TOKEN : ", token);

    // Clean user input
    setEmail(escapeHtml(email));
    setProfile(escapeHtml(profile));
    setPassword(escapeHtml(password));

    // Get account id
    let accountID = localStorage.getItem("userId") || null;
    let authToken = localStorage.getItem("authToken") || null;

    // Account update logic
    try {
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/user`, {
        credentials: "include",
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: email,
          password: password,
          displayName: profile,
          captcha: token
        }),

      });

      if (response.ok) {
        // TODO : More secure storage
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('profile', profile);
        createAlert("Successfully updated!");
      } else {
        // Email already exists
        if (response.status === 400) {
          createAlert('Email already in use!');
        // Not authorized
        } else if (response.status === 401) {
          createAlert('Unauthorized change!');
        // All other errors
        } else {
          createAlert('Internal server error.');
          console.log("Error : ", response.status, response.statusText)
        }
      }
    } catch (error) {
      createAlert('Internal server error.');
      console.log("Error : ", error)
    }
  };


  // Handles account deletion
  window.accountDelete = async(token) => {
    // Get account id
    let accountID = localStorage.getItem("userId") || null;
    let authToken = localStorage.getItem("authToken") || null;

    // Account delete logic
    try {
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/user`, {
        credentials: "include",
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        // TODO : More secure storage
        localStorage.removeItem('email');
        localStorage.removeItem('password');
        localStorage.removeItem('profile');
        onClose();
        createAlert("Successfully deleted!");
      } else {
        // Not authorized
        if (response.status === 401) {
          createAlert('Unauthorized change!');
        // All other errors
        } else {
          createAlert('Internal server error.');
          console.log("Error : ", response.status, response.statusText)
        }
      }
    } catch (error) {
      createAlert('Internal server error.');
      console.log("Error : ", error)
    }
  }


  // Handle logging out
  const logOut = (rerender) => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    localStorage.removeItem('profile');

    rerender();
    createAlert("Successfully logged out.");
    onClose();
  }


  return (
    <div id="profile-popup-overlay">
      <div id="profile-popup">

        {/* Close button */}
        <button id="close-button" onClick={onClose}>x</button>

        {/* Profile header */}
        <div id="profile-header">
          <h2 id="title">Profile</h2>
        </div>

        {/* Profile form */}
        <div id="profile-content">
          <form onSubmit={(event) => { event.preventDefault(); }}>

            {/* Display Name */}
            <label>Name:</label>
            <input value={profile}
              onChange={handleProfileChange}
              pattern="[A-Za-z0-9]{3,24}"
              title="Name must be an alphanumeric string between 3-24 characters"
              required />

            {/* Email */}
            <label>Email:</label>
            <input type="email" value={email}
              onChange={handleEmailChange} required />

            {/* Password */}
            <label>Password:</label>
            <input type={showPassword ? "text" : "password"} value={password}
              onChange={handlePasswordChange} 
              pattern=".{8,}"
              title="Password must be at least 8 characters long"
              required />

            {/* Password options (show) */}
            <div id="password-options">
              <span id="show-password" onClick={() => setShowPassword(!showPassword)} >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            {/* reCAPTCHA and update button */}
            <Tooltip text="Updates user profile.">
              <button id="update" className="g-recaptcha" 
                data-sitekey="6Lddz84pAAAAAOoVxY1bFZUQqaxLb8XCHGeVYSaL"
                data-callback='accountUpdate' data-action='submit'>
                Update
              </button>
            </Tooltip>
          </form>
          {/* Logout button */}
          <Tooltip text="Logs out.">
            <button id="logout" onClick={() => logOut(rerender)}>
              Log Out
            </button>
          </Tooltip>
          {/* reCAPTCHA and delete button */}
          <Tooltip text="Deletes user profile.">
            <button id="delete" className="g-recaptcha"
              data-sitekey="6Lddz84pAAAAAOoVxY1bFZUQqaxLb8XCHGeVYSaL"
              data-callback='accountDelete'>
              Delete Account
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Profile;
