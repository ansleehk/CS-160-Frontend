import "./Topbar.css";

import React from "react";
import createAlert from "../utilities/Alert";

class Topbar extends React.Component {
  render() {
    return (
      <div id="Topbar" data-testid="Topbar">
        <b id="Title">
          <span id="Name">KeyLink</span>
          <span id="Version"> V1.0</span>
        </b>
        <div id="Login">
          <button onClick={() => createAlert('Profiles not implemented!')}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Topbar;