import "./Topbar.css";

import React from "react";
import Tooltip from "../utilities/Tooltip";
import Login from "../popups/Login";

class Topbar extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      showLoginPopup: false
    };
  }


  // Toggles login popup
  toggleLoginPopup = () => {
    this.setState((prevState) => ({
      showLoginPopup: !prevState.showLoginPopup
    }));
  };


  render() {
    return (
      <div id="Topbar" data-testid="Topbar">
        {/* Title Section */}
        <b id="Title">
          <span id="Site-name">KeyLink</span>
          <span id="Version"> V1.0</span>
        </b>

        {/* User Section */}
        <div id="User">
          <span id="User-name">Guest</span>
          <Tooltip text="Login/signup">
            <button id="Login" onClick={this.toggleLoginPopup}>
              Login
            </button>
          </Tooltip>
        </div>

        {/* Render login popup if true */}
        {this.state.showLoginPopup && (
          <Login onClose={this.toggleLoginPopup} />
        )}
      </div>
    );
  }
}

export default Topbar;