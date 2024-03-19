import "./DiagramViewer.css";

import React from "react";
import Mermaid from "./Mermaid";
import Utilities from "../Utilities";

import generate from "../images/Generate.png";

class DiagramViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramDefinition: null
    };
  }

  render() {
    return (
      <div id="Diagram-viewer" data-testid="DiagramViewer">
        {this.props.diagramDefinition ? (
          <Mermaid chart={this.props.diagramDefinition} width="100%" height="100%"/>
        ) : (
          <>
            <p>Generate Diagram</p>
            <button onClick={() => Utilities.showError("Generate Diagram Not Implemented Yet")}>
              <img src={generate} id="Generate" alt="generate" />
            </button>
          </>
        )}
      </div>
    );
  }
}

export default DiagramViewer;