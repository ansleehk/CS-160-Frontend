import "./CompareViewer.css";

import React from "react";
import Diagram from "../utilities/Diagram";
// import createAlert from "../utilities/Alert";
// import Tooltip from "../utilities/Tooltip";

class CompareViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagramKey: 0, // Initialize a key for forcing re-renders
    };
  }


  // Update diagram if props changed
  componentDidUpdate(prevProps) {
    if (prevProps.diagramDefinition !== this.props.diagramDefinition) {
      this.setState({ diagramKey: this.state.diagramKey + 1 });
    }
  }


  render() {
    return (
      <div id="Compare-viewer" data-testid="CompareViewer">
        {this.props.diagramDefinition ? (
          <>
            {/* Summary Box */}
            <p id="compare-summary">
              {this.props.summaryDefinition}
            </p>
            {/* Mermaid Diagram */}
            <Diagram id="compare-diagram" key={this.state.diagramKey}
                     mermaid={this.props.diagramDefinition} />
          </>
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