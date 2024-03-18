import "./DiagramViewer.css";

import React from "react";
import Mermaid from "./Mermaid";
import Utilities from "../Utilities";

import generate from "../images/Generate.png";

class DiagramViewer extends React.Component {
  constructor(props) {
    super(props);
    const temp = `
    graph LR
      A[Nuclear Power] --> B[Fukushima]
      C[Greens] --> B[Fukushima]
      D[Environmentalists] --> A[Nuclear Power]
      A[Nuclear Power] --> G[Nuclear Industry]
      E[Earthquake] --> A[Nuclear Power]
      E[Earthquake] --> B[Fukushima]
      F[Radiations] --> B[Fukushima]
      F[Radiations] --> D[Environmentalists]
      G[Nuclear Industry] --> A[Nuclear Power]
      G[Nuclear Industry] --> D[Environmentalists]
      G[Nuclear Industry] --> C[Greens]
      G[Nuclear Industry] --> E[Earthquake]
      G[Nuclear Industry] --> F[Radiations]
    `;
    this.state = {
      diagramDefinition: temp
    };
  }

  generateDiagram = () => {
    // Define your Mermaid diagram here
    const diagramDefinition = `
    graph LR
      A[Nuclear Power] --> B[Fukushima]
      C[Greens] --> B[Fukushima]
      D[Environmentalists] --> A[Nuclear Power]
      A[Nuclear Power] --> G[Nuclear Industry]
      E[Earthquake] --> A[Nuclear Power]
      E[Earthquake] --> B[Fukushima]
      F[Radiations] --> B[Fukushima]
      F[Radiations] --> D[Environmentalists]
      G[Nuclear Industry] --> A[Nuclear Power]
      G[Nuclear Industry] --> D[Environmentalists]
      G[Nuclear Industry] --> C[Greens]
      G[Nuclear Industry] --> E[Earthquake]
      G[Nuclear Industry] --> F[Radiations]
    `;
    this.setState({ diagramDefinition });
  };

  render() {
    return (
      <div id="Diagram-viewer" data-testid="DiagramViewer">
        <p>Generate Diagram</p>
        <button onClick={this.generateDiagram}>
          <img src={generate} id="Generate" alt="generate" />
        </button>
        <Mermaid chart={this.state.diagramDefinition} />
      </div>
    );
  }
}

export default DiagramViewer;