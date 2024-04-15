import React, { useState, useEffect } from "react";
import "./SettingsPopup.css";

import del from "../images/Delete.png";
import add from "../images/Add.png";
import Themes from "../utilities/Themes.js";

const SettingsPopup = ({ onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState(() => 
    parseInt(localStorage.getItem("selectedPreset")) || 0);
  const [userThemes, setUserThemes] = useState(() =>
    JSON.parse(localStorage.getItem("userThemes")) || []);
  const [newThemeName, setNewThemeName] = useState("");
  const [currentColor, setCurrentColor] = useState(() => {
    const defaultTheme = Themes[0].colors;
    return {
      c_main1: localStorage.getItem("c_main1") || defaultTheme.c_main1,
      c_accent1: localStorage.getItem("c_accent1") || defaultTheme.c_accent1,
      c_main2: localStorage.getItem("c_main2") || defaultTheme.c_main2,
      c_accent2: localStorage.getItem("c_accent2") || defaultTheme.c_accent2,
      c_highlight: localStorage.getItem("c_highlight") || defaultTheme.c_highlight,
      c_headtext: localStorage.getItem("c_headtext") || defaultTheme.c_headtext,
      c_maintext: localStorage.getItem("c_maintext") || defaultTheme.c_maintext,
      c_subtext: localStorage.getItem("c_subtext") || defaultTheme.c_subtext,
      c_alttext: localStorage.getItem("c_alttext") || defaultTheme.c_alttext,
    };
  });

  useEffect(() => {
  const selectedPresetIndex = parseInt(localStorage.getItem("selectedPreset")) || 0;
  setSelectedPreset(selectedPresetIndex);
}, []);

useEffect(() => {
  if (selectedPreset < Themes.length) {
    const presetColors = Themes[selectedPreset].colors;
    setCurrentColor(presetColors);
    Object.keys(presetColors).forEach((name) => {
      const storedColor = localStorage.getItem(name);
      if (storedColor) document.documentElement.style.setProperty(`--${name}`, storedColor);
    });
  } else {
    const customThemeIndex = selectedPreset - Themes.length;
    const customTheme = userThemes[customThemeIndex];
    if (customTheme && customTheme.colors) {
      setCurrentColor(customTheme.colors);
      Object.keys(customTheme.colors).forEach((name) => {
        const storedColor = localStorage.getItem(name);
        if (storedColor) document.documentElement.style.setProperty(`--${name}`, storedColor);
      });
    } else {
      const defaultTheme = Themes[0].colors;
      setCurrentColor(defaultTheme);
      Object.keys(defaultTheme).forEach((name) => {
        localStorage.setItem(name, defaultTheme[name]);
        document.documentElement.style.setProperty(`--${name}`, defaultTheme[name]);
      });
    }
  }

  localStorage.setItem("userThemes", JSON.stringify(userThemes));
}, [selectedPreset, userThemes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentColor((prevColor) => ({ ...prevColor, [name]: value }));
    document.documentElement.style.setProperty(`--${name}`, value);
  };

  const handlePresetChange = (e) => {
    const index = e.target.value;
    setSelectedPreset(index);
    localStorage.setItem("selectedPreset", index);
    
    if (index < Themes.length) {
      const presetColors = Themes[index].colors;
      setCurrentColor(presetColors);
      Object.keys(presetColors).forEach((name) => {
        localStorage.setItem(name, presetColors[name]);
        document.documentElement.style.setProperty(`--${name}`, presetColors[name]);
      });
    } else {
      const customThemeIndex = index - Themes.length;
      const customTheme = userThemes[customThemeIndex];
      if (customTheme && customTheme.colors) {
        setCurrentColor(customTheme.colors);
        Object.keys(customTheme.colors).forEach((name) => {
          localStorage.setItem(name, customTheme.colors[name]);
          document.documentElement.style.setProperty(`--${name}`, customTheme.colors[name]);
        });
      } else {
        const defaultTheme = Themes[0].colors;
        setCurrentColor(defaultTheme);
        Object.keys(defaultTheme).forEach((name) => {
          localStorage.setItem(name, defaultTheme[name]);
          document.documentElement.style.setProperty(`--${name}`, defaultTheme[name]);
        });
      }
    }
  };

  const handleThemeDelete = (index) => {
    const updatedThemes = [...userThemes];
    updatedThemes.splice(index, 1);
    setUserThemes(updatedThemes);
  
    // Reset the website colors and selection to the default ones
    const defaultThemeColors = Themes[0].colors;
    setCurrentColor(defaultThemeColors);
    Object.keys(defaultThemeColors).forEach((name) => {
      localStorage.setItem(name, defaultThemeColors[name]);
      document.documentElement.style.setProperty(`--${name}`, defaultThemeColors[name]);
    });
  
    // Set selected preset index to 0 and update local storage
    setSelectedPreset(0);
    localStorage.setItem("selectedPreset", 0);
  
    // Update user themes in local storage
    localStorage.setItem("userThemes", JSON.stringify(updatedThemes));
  };

  const handleAddTheme = () => {
    const newTheme = {
      label: newThemeName,
      colors: { ...currentColor },
    };
  
    const updatedThemes = [...userThemes, newTheme];
    setUserThemes(updatedThemes);
    localStorage.setItem("userThemes", JSON.stringify(updatedThemes)); // Store updated themes in local storage
  
    // Determine the index of the newly added theme
    const newIndex = Themes.length + updatedThemes.length - 1;
  
    // Update the selected preset index and store it in local storage
    setSelectedPreset(newIndex);
    localStorage.setItem("selectedPreset", newIndex);
  
    // Update the website's appearance with the new theme's colors
    const newThemeColors = updatedThemes[newIndex - Themes.length].colors;
    setCurrentColor(newThemeColors);
    Object.keys(newThemeColors).forEach((name) => {
      localStorage.setItem(name, newThemeColors[name]);
      document.documentElement.style.setProperty(`--${name}`, newThemeColors[name]);
    });
  };

  return (
    <div id="settings-popup-overlay">
      <div id="settings-popup">
        <button id="close-button" onClick={onClose}>x</button>
        <h2 id="title">Color Settings</h2>
        <div id="theme-preset">
          <label htmlFor="preset">Choose a Preset : </label>
          <select id="preset" name="preset" value={selectedPreset} onChange={handlePresetChange}>
            {Themes.map((preset, index) => (
              <option key={index} value={index}>{preset.label}</option>
            ))}
            {userThemes.map((theme, index) => (
              <option key={index + Themes.length} value={index + Themes.length}>{theme.label}</option>
            ))}
          </select>
          {selectedPreset >= Themes.length && (
            <button id="delete-button" onClick={() => handleThemeDelete(selectedPreset - Themes.length)}>
              <img src={del} id="delete-theme" alt="delete theme" />
            </button>
          )}
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
        <div id="theme-adder">
          <input type="text" placeholder="Enter theme name" value={newThemeName} onChange={(e) => setNewThemeName(e.target.value)} />
          <button id="add-button" onClick={handleAddTheme}>
            <img src={add} id="add-theme" alt="add theme" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPopup;
