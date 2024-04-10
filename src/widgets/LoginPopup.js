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

  return (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <button className="close-button" onClick={onClose}>x</button>
        <div className="login-header">
          <h2>User Login</h2>
        </div>
        <div className="tab-header">
          <span
            className={tab === "signin" ? "active" : ""}
            onClick={() => handleTabChange("signin")}
          >
            Sign in
          </span>
          <span
            className={tab === "signup" ? "active" : ""}
            onClick={() => handleTabChange("signup")}
          >
            Sign up
          </span>
        </div>
        <div className="login-content">
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <label>Password:</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                required
              />
              {tab === "signin" && (
                <span className="password-help">Password help</span>
              )}
              <span
                className="show-password"
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
