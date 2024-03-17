import "./DiagramViewer.css";

import React from "react";
import Utilities from "../Utilities";

import generate from "../images/Generate.png";

class DiagramViewer extends React.Component {
  render() {
    return (
      <div id="Diagram-viewer" data-testid="DiagramViewer">
        <p>Generate Diagram</p>
        <button onClick={() => Utilities.showError('Generate Diagram not implemented!')}>
          <img src={generate} id="Generate" alt="generate" />
        </button>
      </div>
    );
  }
}

export default DiagramViewer;