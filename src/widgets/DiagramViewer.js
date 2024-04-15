import "./DiagramViewer.css";

import React from "react";
import Mermaid from "./Mermaid";
import createAlert from "../utilities/Alert";

import generate from "../images/Generate.png";

class DiagramViewer extends React.Component {
  render() {
    return (
      <div id="Diagram-viewer" data-testid="DiagramViewer">
        {this.props.isLoading ? (
          // Loading indicator
          <>
            <p>Generating Diagram...</p>
            <div id="loader"></div>
          </>
        ) : this.props.diagramDefinition ? (
          // Mermaid diagram
          <Mermaid chart={this.props.diagramDefinition} width="100%" height="100%"/>
        ) : (
          // Generate diagram button
          <>
            <p>Generate Diagram</p>
            <button onClick={() => createAlert("Regenerate Diagram Not Implemented Yet")}>
              <img src={generate} id="Generate" alt="generate" />
            </button>
          </>
        )}
      </div>
    );
  }
}

export default DiagramViewer;