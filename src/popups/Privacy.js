import React from "react";
import "./Privacy.css";

const Privacy = ({ onClose }) => {

  return (
    <div id="privacy-popup-overlay">
      <div id="privacy-popup">

        {/* Close button */}
        <button id="close-button" onClick={onClose}>x</button>

        {/* Title */}
        <h2 id="title">Privacy Policy</h2>

        {/* Content */}
        <div id="policy">
          <p><strong>1. Information Collected:</strong> We collect email addresses during account creation and PDF files uploaded during interactions with our service.</p>

          <p><strong>2. How Information is Processed:</strong> Information is processed to personalize the user experience on our website.</p>

          <p><strong>3. Data Sharing:</strong> We do not sell user data. However, information contained within uploaded PDF files is shared with ChatGPT for processing.</p>

          <p><strong>4. User Rights:</strong> Users have the right to delete PDF files from their accounts or delete their accounts entirely. We do not retain any records beyond user deletion requests.</p>

          <p><strong>Contact Details:</strong> For inquiries or concerns regarding this privacy policy, users can leave us a message at our <a href="https://github.com/ansleehk/CS-160/issues">Github Project</a>.</p>

          <p>This privacy policy governs the collection, processing, and sharing of user information on our website. By using our services, users consent to the practices outlined in this policy.</p>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
