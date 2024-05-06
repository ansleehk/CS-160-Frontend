import React, { useState } from "react";
import "./Tooltip.css";

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  let timeout;

  const handleMouseEnter = () => {
    timeout = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
    setShowTooltip(false);
  };

  return (
    <div className="tooltip-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {showTooltip && <div className="tooltip">{text}</div>}
      {children}
    </div>
  );
};

export default Tooltip;
