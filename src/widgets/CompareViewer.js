import "./CompareViewer.css";

import React from "react";
import Mermaid from "../utilities/Mermaid";
// import createAlert from "../utilities/Alert";
// import Tooltip from "../utilities/Tooltip";

class CompareViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramKey: 0, // Initialize a key for forcing re-renders
      summaryKey: 0
    };
  }


  // Update diagram if props changed
  componentDidUpdate(prevProps) {
    if (prevProps.diagramDefinition !== this.props.diagramDefinition) {
      this.setState({ diagramKey: this.state.diagramKey + 1 });
    }

    if (prevProps.summaryDefinition !== this.props.summaryDefinition) {
      this.setState({ summaryKey: this.state.summaryKey + 1 });

      // Get the height of the summary box
      const summaryHeight = document.getElementById('summary-box').offsetHeight;

      // Set the padding-top of the diagram container to match the height of the summary box
      document.getElementById('diagram-container').style.top = `${summaryHeight}px`;
    }
  }


  render() {
    return (
      <div id="Diagram-viewer" data-testid="DiagramViewer">
        {this.props.diagramDefinition ? (
          
          <div id="content">
            {/* Summary Box */}
            <div id="summary-box">
              <p id="summary" key={this.state.summaryDefinition}>
                {this.props.summaryDefinition}
              </p>
            </div>
            <div id="diagram-container">
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
            <p>Compare Diagram</p>
            <p id="explain">Loaded diagrams show up here</p>
          </>
        )}
      </div>
    );
  }
}

export default CompareViewer;