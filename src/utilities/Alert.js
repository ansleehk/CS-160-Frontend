import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./Alert.css";

const Alert = ({ message }) => {
  const [showAlert, setShowAlert] = useState(true);
  const [dismissable, setDismissable] = useState(false);


  // Alert must show for at least 0.5sec
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDismissable(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);


  // Click to remove alert after timer
  const handleAlertClick = () => {
    if (dismissable) {
      setShowAlert(false);
    }
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
  const root = createRoot(div);
  root.render(<Alert message={message} />);
};

export default createAlert;