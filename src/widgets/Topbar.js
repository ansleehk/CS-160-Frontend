import "./Topbar.css";

import React from "react";
import Utilities from "../Utilities";

class Topbar extends React.Component {
  render() {
    return (
      <div id="Topbar" data-testid="Topbar">
        <b id="Title">KeyLink V1.0</b>
        <div id="Login">
          <button onClick={() => Utilities.showError('Profiles not implemented!')}>
            Login
          </button>
        </div>
      </div>
    );
  }
}

export default Topbar;