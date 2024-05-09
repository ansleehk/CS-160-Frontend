import "./Sidebar.css";

import React from "react";
// import createAlert from "../utilities/Alert";
import Tooltip from "../utilities/Tooltip";
import Privacy from "../popups/Privacy.js";
import Settings from "../popups/Settings.js";
import ArticleList from "./ArticleList.js";

import sidebar from "../images/Sidebar.png";
import upload from "../images/Upload.png";
import generate from "../images/Generate.png";
import pdf from "../images/PDF.png";
import diagram from "../images/Diagram.png";
import settings from "../images/Settings.png";
import reset from "../images/Reset.png";
import privacy from "../images/Privacy.png";

class Sidebar extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      showSettings: false,
      showPrivacyPolicy: false
    };
  }

  // Toggles privacy popup
  togglePrivacyPopup = () => {
    this.setState((prevState) => ({
      showPrivacyPolicy: !prevState.showPrivacyPolicy
    }));
  };

  
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
              <Tooltip text="Closes sidebar">
                <button onClick={() => this.toggleSidebar()}>
                  <img src={sidebar} id="Sidebar-close" alt="close sidebar"
                    style={{ transform: 'rotate(180deg)' }} />
                </button>
              </Tooltip>
            </div>

            {/* List of articles */}
            <ArticleList id="Article-list"
                         loadArticle={this.props.loadArticle}
                         deleteFromLocal={this.props.deleteFromLocal}
                         toggleRefresh={this.props.toggleRefresh}
                         regenDiagram={this.props.regenDiagram}
                         showPdf={this.props.showPdf} />

            {/* Open bottom menu */}
            <div id="Open-sidebar-bottom">
              <Tooltip id="Reset-tooltip" text="Clears current PDF/diagram">
                <button id="New-article" onClick={this.props.onReset}>
                  <img src={reset} id="New" alt="new article" />
                </button>
              </Tooltip>
              <Tooltip id="Privacy-tooltip" text="Shows privacy policy">
                <button id="Privacy-policy" onClick={this.togglePrivacyPopup}>
                  <img src={privacy} id="Privacy" alt="privacy policy" />
                </button>
              </Tooltip>
              {this.state.showPrivacyPolicy && <Privacy onClose={this.togglePrivacyPopup} />}
              <Tooltip id="Settings-open-tooltip" text="Opens settings">
                <button id="Settings-open" onClick={this.toggleSettingsPopup}>
                  <img src={settings} id="Settings" alt="settings" />
                </button>
              </Tooltip>
              {this.state.showSettings && <Settings onClose={this.toggleSettingsPopup} />}
            </div>
          </div>
        ) : (

          // Closed sidebar view
          <div id="Closed-sidebar">
            <div id="Closed-sidebar-top">
              <Tooltip text="Opens sidebar">
                <button onClick={() => this.toggleSidebar()}>
                  <img src={sidebar} id="Sidebar-open" alt="open sidebar" />
                </button>
              </Tooltip>
            </div>

          
            {/* Functionality */}
            <Tooltip text="Upload PDF for diagram generation">
            <button onClick={() => document.getElementById("PDF-input").click()}>
              <img src={upload} id="Upload" alt="upload" />
            </button>
            </Tooltip>
            <input id="PDF-input" type="file" accept=".pdf"
              onChange={this.props.onPDFChange}
              style={{ display: "none" }}/>
            <Tooltip text="Regenerate a diagram">
              <button onClick={this.props.regenDiagram}>
                <img src={generate} id="Generate" alt="generate" />
              </button>
            </Tooltip>
            <Tooltip text="Toggles PDF visibility">
              <button onClick={this.props.togglePDF}>
                <img src={pdf} id="Toggle-pdf" alt="toggle pdf" />
              </button>
            </Tooltip>
            <Tooltip text="Toggles diagram comparer visibility">
              <button onClick={this.props.toggleCompare}>
                <img src={diagram} id="Toggle-diagram" alt="toggle diagram" />
              </button>
            </Tooltip>
            <Tooltip text="Toggles diagram visibility">
              <button onClick={this.props.toggleDiagram}>
                <img src={diagram} id="Toggle-diagram" alt="toggle diagram" />
              </button>
            </Tooltip>

            {/* Settings */}
            <div id="Closed-sidebar-bottom">
              <Tooltip text="Opens settings">
                <button id="Settings-close" onClick={this.toggleSettingsPopup}>
                  <img src={settings} id="Settings" alt="settings" />
                </button>
              </Tooltip>
              {this.state.showSettings && <Settings onClose={this.toggleSettingsPopup} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;