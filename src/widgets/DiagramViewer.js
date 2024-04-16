import "./DiagramViewer.css";

import React from "react";
import Mermaid from "./Mermaid";
import createAlert from "../utilities/Alert";

import generate from "../images/Generate.png";
import localSave from "../images/Add.png";
import diagramToImage from "../images/Delete.png";

class DiagramViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramKey: 0 // Initialize a key for forcing re-renders
    };
  }

  // TODO : Connect to backend to get image
  saveDiagramAsImage = () => {
    createAlert("Save Diagram as Image not implemented yet.")
  }


  // Update diagram if props changed
  componentDidUpdate(prevProps) {
    if (prevProps.diagramDefinition !== this.props.diagramDefinition) {
      this.setState({ diagramKey: this.state.diagramKey + 1 });
    }
  }


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
          <>
            <div id="diagram-options">
              <button onClick={this.props.saveToLocal}>
                <img src={localSave} alt="save locally" />
              </button>
              <button onClick={this.saveDiagramAsImage}>
                <img src={diagramToImage} alt="save diagram" />
              </button>
            </div>
            <div id="mermaid-container">
              <Mermaid id="mermaid" key={this.state.diagramKey}
                                    chart={this.props.diagramDefinition}
                                    width="100%"
                                    height="100%"/>
            </div>
          </>
        ) : (
          // Generate diagram button
          <>
            <p>Generate Diagram</p>
            <button onClick={this.props.regenDiagram}>
              <img src={generate} alt="generate" />
            </button>
          </>
        )}
      </div>
    );
  }
}

export default DiagramViewer;