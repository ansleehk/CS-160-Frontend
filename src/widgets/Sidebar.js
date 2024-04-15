import "./Sidebar.css";

import React from "react";
import createAlert from "../utilities/Alert";
import SettingsPopup from "../widgets/SettingsPopup";

import sidebar from "../images/Sidebar.png";
import upload from "../images/Upload.png";
import generate from "../images/Generate.png";
import settings from "../images/Settings.png";
import testArticles from "../testArticles.json"; // Test articles

class Sidebar extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      articles: [],
      showSettings: false
    };
  }

  
  // Toggles settings popup
  toggleSettingsPopup = () => {
    this.setState((prevState) => ({
      showSettings: !prevState.showSettings
    }));
  };

  // Fetch articles when the component mounts
  // Change to onlogin later on
  componentDidMount() {
    this.setState({ articles: testArticles });
    /*
    fetch("../testArticles.json") // Temporary json testing, possibly allow local storage?
      .then(response => response.json())
      .then(data => {
        this.setState({ articles: data });
      })
      .catch(error => {
        createAlert("Error fetching articles: " + error);
      });
      */
  }


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
            <div id="Article-list">
              <ul>
                {this.state.articles.map(article => (
                  <li key={article.ArticleID} id="Article-item">
                    <button onClick={() => console.log("Article clicked:", article)} id="Article-button">
                      <div id="Article-title">{article.Title}</div>
                      <div id="Article-id">{"UUID : " + article.StorageArticleUUID}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
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