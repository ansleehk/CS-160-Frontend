import "./Sidebar.css";

import React from "react";
import Utilities from "../Utilities";

import upload from "../images/Upload.png";
import generate from "../images/Generate.png";

class Sidebar extends React.Component {
  openSideBar() {
    document.getElementById("Open-sidebar").style.display = "inline-flex";
    document.getElementById("Closed-sidebar").style.display = "none";
  }

  closeSideBar() {
    document.getElementById("Closed-sidebar").style.display = "inline-flex";
    document.getElementById("Open-sidebar").style.display = "none";
  }

  // TODO : Change to render like PDFViewer, instead of hiding one
  render() {
    return (
      <div id="Sidebar" data-testid="Sidebar">
        <div id="Open-sidebar">
          <div id="Sidebar-top">
            <b>Sidebar content</b>
            <button onClick={() => this.closeSideBar()}>
              Close sidebar
            </button>
          </div>
        </div>
        <div id="Closed-sidebar">
          <button onClick={() => this.openSideBar()}>
              Open Sidebar
          </button>
          <label for="PDF-input">
              <img src={upload} id="Upload" alt="upload"/>
          </label>
          <input id="PDF-input" type="file" accept=".pdf" 
              onChange={this.props.onPDFChange}/>
          <button onClick={() => Utilities.showError('Generate Diagram not implemented!')}>
              <img src={generate} id="Generate" alt="generate" />
          </button>
        </div>
      </div>
    );
  }
}

export default Sidebar;