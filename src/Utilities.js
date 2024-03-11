import React from 'react';
// import './Utilities.css';

class Utilities extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isVisible: false,
        errorMessage: ''
      };
    }
  
    static showError(message) {
        alert(message);
    }
  
    render() {
      return (
        <div className={this.state.isVisible ? 'error-popup visible' : 'error-popup'}>
          {this.state.errorMessage}
        </div>
      );
    }
  }
  
  export default Utilities;