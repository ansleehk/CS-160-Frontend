import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Alert.css";

const Alert = ({ message }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  const handleAlertClick = () => {
    setShowAlert(false);
  };

  return (
    <>
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

const createAlert = (message) => {
  const div = document.createElement("div");
  document.body.appendChild(div);

  ReactDOM.render(<Alert message={message} />, div);

  setTimeout(() => {
    ReactDOM.unmountComponentAtNode(div);
    div.remove();
  }, 3000);
};

export default createAlert;