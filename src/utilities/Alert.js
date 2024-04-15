import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Alert.css";

const Alert = ({ message }) => {
  const [showAlert, setShowAlert] = useState(true);


  // Auto-dismiss after 3 sectons
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);


  // Click to remove alert
  const handleAlertClick = () => {
    setShowAlert(false);
  };


  return (
    <>
    {/* render overlay if showAlert true */}
      {showAlert && (
        <div id="alert-overlay" onClick={handleAlertClick}>
          <div id="alert" onClick={handleAlertClick}>
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
};


// Create and display alert
const createAlert = (message) => {
  // Mount to div
  const div = document.createElement("div");
  document.body.appendChild(div);
  ReactDOM.render(<Alert message={message} />, div);

  // Autoremove after timeout
  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  }, 3000);
};

export default createAlert;