import React, { useState, useEffect } from "react";
import "./SettingsPopup.css";
import Themes from "../utilities/Themes.js"

const SettingsPopup = ({ onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState(() => {
    return parseInt(localStorage.getItem("selectedPreset")) || 0;
  });
  const [userThemes, setUserThemes] = useState([]);
  const [newThemeName, setNewThemeName] = useState("");
  const [currentColor, setCurrentColor] = useState({
    c_main1: localStorage.getItem("c_main1") || Themes[0].colors.c_main1,
    c_accent1: localStorage.getItem("c_accent1") || Themes[0].colors.c_accent1,
    c_main2: localStorage.getItem("c_main2") || Themes[0].colors.c_main2,
    c_accent2: localStorage.getItem("c_accent2") || Themes[0].colors.c_accent2,
    c_highlight: localStorage.getItem("c_highlight") || Themes[0].colors.c_highlight,
    c_headtext: localStorage.getItem("c_headtext") || Themes[0].colors.c_headtext,
    c_maintext: localStorage.getItem("c_maintext") || Themes[0].colors.c_maintext,
    c_subtext: localStorage.getItem("c_subtext") || Themes[0].colors.c_subtext,
    c_alttext: localStorage.getItem("c_alttext") || Themes[0].colors.c_alttext,
  });

  useEffect(() => {
    const userThemesFromStorage = JSON.parse(localStorage.getItem("userThemes")) || [];
    setUserThemes(userThemesFromStorage);
    const selectedPresetIndex = parseInt(localStorage.getItem("selectedPreset")) || 0;
    setSelectedPreset(selectedPresetIndex);
    const presetColors = Themes[selectedPresetIndex].colors;
    setCurrentColor(presetColors);
    Object.keys(presetColors).forEach((name) => {
      const storedColor = localStorage.getItem(name);
      if (storedColor) {
        document.documentElement.style.setProperty(`--${name}`, storedColor);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentColor({ ...currentColor, [name]: value });
    document.documentElement.style.setProperty(`--${name}`, value);
  };

  const handlePresetChange = (e) => {
    const index = e.target.value;
    setSelectedPreset(index);
    const presetColors = Themes[index].colors;
    setCurrentColor(presetColors);
    localStorage.setItem("selectedPreset", index);
    Object.keys(presetColors).forEach((name) => {
      localStorage.setItem(name, presetColors[name]);
      document.documentElement.style.setProperty(`--${name}`, presetColors[name]);
    });
  };

  const handleThemeDelete = (index) => {
    const updatedThemes = [...userThemes];
    updatedThemes.splice(index, 1);
    setUserThemes(updatedThemes);
    localStorage.setItem("userThemes", JSON.stringify(updatedThemes));
  };

  const handleAddTheme = () => {
    const newTheme = {
      label: newThemeName,
      colors: { ...currentColor },
    };
    setUserThemes([...userThemes, newTheme]);
    setNewThemeName("");
    localStorage.setItem("userThemes", JSON.stringify([...userThemes, newTheme]));
  };

  return (
    <div id="settings-popup-overlay">
      <div id="settings-popup">
        <h2>Color Settings</h2>
        <div id="theme-preset">
          <label htmlFor="preset">Choose a Preset : </label>
          <select id="preset" name="preset" value={selectedPreset} onChange={handlePresetChange}>
            {Themes.map((preset, index) => (
              <option key={index} value={index}>{preset.label}</option>
            ))}
          </select>
        </div>
        <div id="color-picker">
          <div id="site-color-label">
            <label htmlFor="c_main1">Main1 : </label>
            <label htmlFor="c_accent1">Accent1 : </label>
            <label htmlFor="c_main2">Main2 : </label>
            <label htmlFor="c_accent2">Accent2 : </label>
            <label htmlFor="c_highlight">Highlight : </label>
          </div>
          <div id="site-color-picker">
              <input type="color" id="c_main1" name="c_main1" value={currentColor.c_main1} onChange={handleChange} />
              <input type="color" id="c_accent1" name="c_accent1" value={currentColor.c_accent1} onChange={handleChange} />
              <input type="color" id="c_main2" name="c_main2" value={currentColor.c_main2} onChange={handleChange} />
              <input type="color" id="c_accent2" name="c_accent2" value={currentColor.c_accent2} onChange={handleChange} />
              <input type="color" id="c_highlight" name="c_highlight" value={currentColor.c_highlight} onChange={handleChange} />
          </div>
          <div id="font-color-label">
              <label htmlFor="c_headtext">Head Text : </label>
              <label htmlFor="c_maintext">Main Text : </label>
              <label htmlFor="c_subtext">Sub Text : </label>
              <label htmlFor="c_alttext">Alt Text : </label>

          </div>
          <div id="font-color-picker">
            <input type="color" id="c_headtext" name="c_headtext" value={currentColor.c_headtext} onChange={handleChange} />
            <input type="color" id="c_maintext" name="c_maintext" value={currentColor.c_maintext} onChange={handleChange} />
            <input type="color" id="c_subtext" name="c_subtext" value={currentColor.c_subtext} onChange={handleChange} />
            <input type="color" id="c_alttext" name="c_alttext" value={currentColor.c_alttext} onChange={handleChange} />
          </div>
        </div>
        <div>
          <input type="text" placeholder="Enter theme name" value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} />
          <button onClick={handleAddTheme}>Add Theme</button>
        </div>
        <div id="theme-list">
          {userThemes.map((theme, index) => (
            <div key={index}>
              <span>{theme.label}</span>
              <button onClick={() => handleThemeDelete(index)}>Delete</button>
            </div>
          ))}
        </div>
        <button id="close-button" onClick={onClose}>x</button>
      </div>
    </div>
  );
};

export default SettingsPopup;
