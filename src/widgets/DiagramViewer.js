import "./DiagramViewer.css";

import React from "react";
import Mermaid from "../utilities/Mermaid";
import createAlert from "../utilities/Alert";
import Tooltip from "../utilities/Tooltip";

import generate from "../images/Generate.png";
import localSave from "../images/LocalSave.png";
import diagramToImage from "../images/Download.png";

class DiagramViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramKey: 0, // Initialize a key for forcing re-renders
      summaryKey: 0
    };
  }

  // TODO : Connect to backend to get image
  // Temporary front end fix
  saveDiagramAsSVG = () => {
    const mermaidContainer = document.querySelector(".mermaid");
    if (mermaidContainer) {
      const svg = mermaidContainer.innerHTML;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = "diagram.svg"; // Set the default filename here
      link.style.display = "none";
      document.body.appendChild(link);
      
      // Programmatically trigger a click event on the anchor element
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      createAlert("Diagram not available.");
    }
  };


  // Update diagram if props changed
  componentDidUpdate(prevProps) {
    if (prevProps.diagramDefinition !== this.props.diagramDefinition) {
      this.setState({ diagramKey: this.state.diagramKey + 1 });
    }

    if (prevProps.summaryDefinition !== this.props.summaryDefinition) {
      this.setState({ summaryKey: this.state.summaryKey + 1 });
    }

    // Get the height of the summary box
    const summaryHeight = document.getElementById('summary-box').offsetHeight;

    // Set the padding-top of the diagram container to match the height of the summary box
    document.getElementById('diagram-container').style.top = `${summaryHeight}px`;
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
          
          <div id="content">
            {/* Summary Box */}
            <div id="summary-box">
              <p id="summary" key={this.state.summaryDefinition}>
                {this.props.summaryDefinition}
              </p>
            </div>
            <div id="diagram-container">
              {/* Diagram Options */}
              <div id="diagram-options">
                <Tooltip text="Save diagram locally">
                  <button onClick={this.props.saveToLocal}>
                    <img src={localSave} alt="save locally" />
                  </button>
                </Tooltip>
                <Tooltip text="Download diagram as svg">
                  <button onClick={this.saveDiagramAsSVG}>
                    <img src={diagramToImage} alt="save diagram" />
                  </button>
                </Tooltip>
              </div>
              {/* Mermaid Diagram */}
              <div id="mermaid-container">
                <Mermaid id="mermaid" key={this.state.diagramKey}
                                      chart={this.props.diagramDefinition}
                                      width="100%"
                                      height="100%"/>
              </div>
            </div>
          </div>
        ) : (
          // Generate diagram button
          <>
            <p>Generate Diagram</p>
            <Tooltip text="Regerenate a diagram">
              <button onClick={this.props.regenDiagram}>
                <img src={generate} alt="generate" />
              </button>
            </Tooltip>
          </>
        )}
      </div>
    );
  }
}

export default DiagramViewer;