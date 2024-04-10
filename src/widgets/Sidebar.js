import "./Sidebar.css";

import React from "react";
import createAlert from "../utilities/Alert";

import sidebar from "../images/Sidebar.png";
import upload from "../images/Upload.png";
import generate from "../images/Generate.png";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false
    };
  }

  toggleSidebar = () => {
    this.setState((prevState) => ({
      sidebarOpen: !prevState.sidebarOpen
    }));
  };

  render() {
    return (
      <div id="Sidebar" data-testid="Sidebar">
        { this.state.sidebarOpen ? (
          <div id="Open-sidebar">
            <div id="Open-sidebar-top">
              <b>Saved Articles</b>
              <button onClick={() => this.toggleSidebar()}>
                <img src={sidebar} id="Sidebar-close" alt="close sidebar"
                  style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
          </div>
        ) : (
          <div id="Closed-sidebar">
            <div id="Closed-sidebar-top">
              <button onClick={() => this.toggleSidebar()}>
                <img src={sidebar} id="Sidebar-open" alt="open sidebar" />
              </button>
            </div>
            <button onClick={() => document.getElementById("PDF-input").click()}>
              <img src={upload} id="Upload" alt="upload" />
            </button>
            <input id="PDF-input" type="file" accept=".pdf"
              onChange={this.props.onPDFChange}
              style={{ display: "none" }}/>
            <button onClick={() => createAlert('Regenerate Diagram not implemented!')}>
              <img src={generate} id="Generate" alt="generate" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;