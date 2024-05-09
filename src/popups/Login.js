import React, { useState, useEffect } from "react";

import "./Login.css";

import createAlert from "../utilities/Alert";

const Login = ({ rerender, onClose }) => {

  // State variables
  const [tab, setTab] = useState("signin");
  const [profile, setProfile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);

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


  const handleLoaded = () => {
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6Lddz84pAAAAAOoVxY1bFZUQqaxLb8XCHGeVYSaL", { action: "form_submission" })
        .then(token => {
          setCaptchaToken(token);
        });
    });
  };


  useEffect(() => {
    // Add reCaptcha script when the component mounts
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js?render=6Lddz84pAAAAAOoVxY1bFZUQqaxLb8XCHGeVYSaL";
    script.addEventListener("load", handleLoaded);
    document.body.appendChild(script);

    // Clean up function to remove the script when the component unmounts
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


  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }


  // Handles form sumbission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if ((tab === 'signup') && (password !== confirmPassword)) {
      createAlert('Passwords do not match');
      return;
    }

    // Clean user input
    setEmail(escapeHtml(email));
    setProfile(escapeHtml(profile));
    setPassword(escapeHtml(password));

    // Send to login/signup logic
    const result = (tab === "signin") ? await signIn(email, password, captchaToken) : await signUp(email, password, profile, captchaToken);

    // Close popup on successful response
    if (result) {
      rerender();
      onClose();
    } 
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
        console.log("R1 : ", data);

        // TODO : more secure storage
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('profile', data.data.displayName);

        console.log(`UserInfo : UserID(${localStorage.getItem('userId')})`);

        createAlert("Successfully logged in!");
        return true;
      } else {
        // Email not found
        if (response.status === 400) {
          const data = await response.text();
          createAlert(data);
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
        localStorage.setItem('authToken', data.data.token);
        localStorage.setItem('userId', data.data.userId);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('profile', data.data.displayName);

        createAlert("Registration successful.")
        return true;
      } else {
        // An signup error (ie. email in use, password not strong enough)
        if (response.status === 400) {
          const data = await response.text();
          createAlert(data);
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
          <form onSubmit={handleSubmit}>

            {tab === "signup" && (
              <>
              <label>Name:</label>
              <input value={profile}
                onChange={handleProfileChange}
                pattern="[A-Za-z0-9]{3,32}"
                title="Name must be an alphanumeric string between 3-32 characters"
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
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$"
              title="Password must be between 8 and 32 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special symbol (@$!%*?&)"
              required />
            {password.length > 0 && (
              <div className="validation-message">
                {password.length < 8 && <div className="validation-message">Password must be at least 8 characters long</div>}
                {!/[a-z]/.test(password) && <div className="validation-message">Password must contain at least one lowercase letter</div>}
                {!/[A-Z]/.test(password) && <div className="validation-message">Password must contain at least one uppercase letter</div>}
                {!/\d/.test(password) && <div className="validation-message">Password must contain at least one number</div>}
                {!/[@$!%*?&]/.test(password) && <div className="validation-message">Password must contain at least one special symbol (@$!%*?&)</div>}   
              </div>
            )}
            {tab === "signup" && (
              <>
              <label>Confirm Password:</label>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={handleConfirmPasswordChange} required />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                  <div className="validation-message">Passwords do not match</div>
              )}
              </>
            )}

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

            {/* reCAPTCHA */}
            <div
              className="g-recaptcha"
              data-sitekey="6Lddz84pAAAAAOoVxY1bFZUQqaxLb8XCHGeVYSaL"
              data-size="invisible"
              data-callback="onSubmit">
            </div>
            <button type='submit'>
              {tab === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
