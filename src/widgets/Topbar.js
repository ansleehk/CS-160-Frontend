import "./Topbar.css";

import React from "react";
import Tooltip from "../utilities/Tooltip";
import Login from "../popups/Login";
import Profile from "../popups/Profile";

class Topbar extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      userName: localStorage.getItem("profile"),
      authToken: localStorage.getItem("authToken"),
      showLoginPopup: false,
      showProfilePopup: false
    };
  }


  // Toggles login popup
  toggleLoginPopup = () => {
    this.setState((prevState) => ({
      showLoginPopup: !prevState.showLoginPopup
    }));
  };


  // Toggles profile popup
  toggleProfilePopup = () => {
    this.setState((prevState) => ({
      showProfilePopup: !prevState.showProfilePopup
    }));
  };


  // Rerenders topbar
  rerender = () => {
    this.setState({
      userName: localStorage.getItem("profile"),
      authToken: localStorage.getItem("authToken"),
      showLoginPopup: false,
      showProfilePopup: false
    });
  }


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
          {this.state.authToken ? (
            <> {/* Logged in */}
            <span id="User-name">{this.state.userName}</span>
            <Tooltip text="Manage account">
              <button id="Profile" onClick={this.toggleProfilePopup}>
                Profile
              </button>
            </Tooltip>

            {/* Render profile popup if true */}
            {this.state.showProfilePopup && (
              <Profile rerender={this.rerender}
                       onClose={this.toggleProfilePopup} />
            )}
            </>
          ) : (
            <> {/* Guest user */}
            <span id="User-name">Guest</span>
            <Tooltip text="Login/signup">
              <button id="Login" onClick={this.toggleLoginPopup}>
                Login
              </button>
            </Tooltip>

            {/* Render login popup if true */}
            {this.state.showLoginPopup && (
              <Login rerender={this.rerender}
                     onClose={this.toggleLoginPopup} />
            )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Topbar;