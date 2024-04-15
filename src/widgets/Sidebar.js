import "./Sidebar.css";

import React from "react";
import createAlert from "../utilities/Alert";
import SettingsPopup from "./SettingsPopup.js";
import ArticleList from "./ArticleList.js";

import sidebar from "../images/Sidebar.png";
import upload from "../images/Upload.png";
import generate from "../images/Generate.png";
import pdf from "../images/PDF.png";
import diagram from "../images/Diagram.png";
import settings from "../images/Settings.png";

class Sidebar extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      showSettings: false
    };
  }

  
  // Toggles settings popup
  toggleSettingsPopup = () => {
    this.setState((prevState) => ({
      showSettings: !prevState.showSettings
    }));
  };


  // Opens/closes sidebar
  toggleSidebar = () => {
    this.setState((prevState) => ({
      sidebarOpen: !prevState.sidebarOpen
    }));
  };


  render() {
    return (
      <div id="Sidebar" data-testid="Sidebar">
        { this.state.sidebarOpen ? (

          // Open sidebar view
          <div id="Open-sidebar">
            <div id="Open-sidebar-top">
              <b>Saved Articles</b>
              <button onClick={() => this.toggleSidebar()}>
                <img src={sidebar} id="Sidebar-close" alt="close sidebar"
                  style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>

            {/* List of articles */}
            <ArticleList/>

            {/* Open bottom menu */}
            <div id="Open-sidebar-bottom">
              <button id="New-article" onClick={this.props.onReset}>New Article</button>
              <button id="Settings-open" onClick={this.toggleSettingsPopup}>
                <img src={settings} id="Settings" alt="settings" />
              </button>
              {this.state.showSettings && <SettingsPopup onClose={this.toggleSettingsPopup} />}
            </div>
          </div>
        ) : (

          // Closed sidebar view
          <div id="Closed-sidebar">
            <div id="Closed-sidebar-top">
              <button onClick={() => this.toggleSidebar()}>
                <img src={sidebar} id="Sidebar-open" alt="open sidebar" />
              </button>
            </div>

          
            {/* Functionality */}
            <button onClick={() => document.getElementById("PDF-input").click()}>
              <img src={upload} id="Upload" alt="upload" />
            </button>
            <input id="PDF-input" type="file" accept=".pdf"
              onChange={this.props.onPDFChange}
              style={{ display: "none" }}/>
            <button onClick={() => createAlert('Regenerate Diagram not implemented!')}>
              <img src={generate} id="Generate" alt="generate" />
            </button>
            <button onClick={this.props.togglePDF}>
              <img src={pdf} id="Toggle-pdf" alt="toggle pdf" />
            </button>
            <button onClick={this.props.toggleDiagram}>
              <img src={diagram} id="Toggle-diagram" alt="toggle diagram" />
            </button>

            {/* Settings */}
            <div id="Closed-sidebar-bottom">
              <button id="Settings-close" onClick={this.toggleSettingsPopup}>
                <img src={settings} id="Settings" alt="settings" />
              </button>
              {this.state.showSettings && <SettingsPopup onClose={this.toggleSettingsPopup} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;