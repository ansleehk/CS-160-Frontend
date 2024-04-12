import "./Topbar.css";

import React from "react";
import LoginPopup from "../widgets/LoginPopup";

class Topbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginPopup: false
    };
  }

  toggleLoginPopup = () => {
    this.setState((prevState) => ({
      showLoginPopup: !prevState.showLoginPopup
    }));
  };

  render() {
    return (
      <div id="Topbar" data-testid="Topbar">
        <b id="Title">
          <span id="Site-name">KeyLink</span>
          <span id="Version"> V1.0</span>
        </b>
        <div id="User">
          <span id="User-name">Guest</span>
          <button id="Login" onClick={this.toggleLoginPopup}>
            Login
          </button>
        </div>
        {this.state.showLoginPopup && (
          <LoginPopup onClose={this.toggleLoginPopup} />
        )}
      </div>
    );
  }
}

export default Topbar;