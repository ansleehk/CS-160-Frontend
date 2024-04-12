import React, { useState } from "react";
import "./SettingsPopup.css";
import Themes from "../utilities/Themes.js"

const SettingsPopup = ({ onClose }) => {
  const [colors, setColors] = useState({
    c_white: localStorage.getItem("c_white") || Themes[0].colors.c_white,
    c_pale: localStorage.getItem("c_pale") || Themes[0].colors.c_pale,
    c_gray: localStorage.getItem("c_gray") || Themes[0].colors.c_gray,
    c_black: localStorage.getItem("c_black") || Themes[0].colors.c_black,
    c_blue: localStorage.getItem("c_blue") || Themes[0].colors.c_blue,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setColors({ ...colors, [name]: value });
    localStorage.setItem(name, value);
    document.documentElement.style.setProperty(`--${name}`, value);
  };

  const handlePresetChange = (presetColors) => {
    setColors(presetColors);
    Object.keys(presetColors).forEach((key) => {
      localStorage.setItem(key, presetColors[key]);
      document.documentElement.style.setProperty(`--${key}`, presetColors[key]);
    });
  };

  return (
    <div className="settings-popup-overlay">
      <div className="settings-popup">
        <h2>Color Settings</h2>
        <div>
          <label htmlFor="preset">Choose a Preset:</label>
          <select
            id="preset"
            name="preset"
            onChange={(e) => handlePresetChange(Themes[e.target.value].colors)}
          >
            {Themes.map((preset, index) => (
              <option key={index} value={index}>{preset.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="c_white">White:</label>
          <input
            type="color"
            id="c_white"
            name="c_white"
            value={colors.c_white}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="c_pale">Pale:</label>
          <input
            type="color"
            id="c_pale"
            name="c_pale"
            value={colors.c_pale}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="c_gray">Gray:</label>
          <input
            type="color"
            id="c_gray"
            name="c_gray"
            value={colors.c_gray}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="c_black">Black:</label>
          <input
            type="color"
            id="c_black"
            name="c_black"
            value={colors.c_black}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="c_blue">Blue:</label>
          <input
            type="color"
            id="c_blue"
            name="c_blue"
            value={colors.c_blue}
            onChange={handleChange}
          />
        </div>
        <div className="settings-buttons">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
