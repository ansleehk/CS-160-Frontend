import "./Sidebar.css";

import React from "react";
import createAlert from "../utilities/Alert";

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
              <b>Sidebar content</b>
              <button onClick={() => this.toggleSidebar()}>
                Close sidebar
              </button>
            </div>
          </div>
        ) : (
          <div id="Closed-sidebar">
            <div id="Closed-sidebar-top">
              <button onClick={() => this.toggleSidebar()}>
                  Open Sidebar
              </button>
            </div>
            <label for="PDF-input">
                <img src={upload} id="Upload" alt="upload"/>
            </label>
            <input id="PDF-input" type="file" accept=".pdf" 
                onChange={this.props.onPDFChange}/>
            <button onClick={() => createAlert('Generate Diagram not implemented!')}>
                <img src={generate} id="Generate" alt="generate" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;