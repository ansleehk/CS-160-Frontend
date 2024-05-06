import React from "react";
import mermaid from "mermaid";
import "./Mermaid.css";

mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose"
});

export default class Mermaid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      isDragging: false,
      offsetX: 0,
      offsetY: 0,
      previousX: 0,
      previousY: 0
    };
    this.mermaidContainerRef = React.createRef();
  }

  componentDidMount() {
    mermaid.contentLoaded();
    if (this.mermaidContainerRef.current) {
      this.mermaidContainerRef.current.addEventListener("wheel", this.handleWheel, { passive: false });
      this.mermaidContainerRef.current.addEventListener("mousedown", this.handleMouseDown);
      this.mermaidContainerRef.current.addEventListener("mousemove", this.handleMouseMove);
      this.mermaidContainerRef.current.addEventListener("mouseup", this.handleMouseUp);
    }
  }

  componentWillUnmount() {
    if (this.mermaidContainerRef.current) {
      this.mermaidContainerRef.current.removeEventListener("wheel", this.handleWheel);
      this.mermaidContainerRef.current.removeEventListener("mousedown", this.handleMouseDown);
      this.mermaidContainerRef.current.removeEventListener("mousemove", this.handleMouseMove);
      this.mermaidContainerRef.current.removeEventListener("mouseup", this.handleMouseUp);
    }
  }

  handleWheel = (event) => {
    event.preventDefault();
    const delta = event.deltaY;
    const scale = this.state.scale - delta / 1000;
    this.setState({ scale });
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    this.setState({
      isDragging: true,
      previousX: event.clientX,
      previousY: event.clientY
    });
  };

  handleMouseMove = (event) => {
    event.preventDefault();
    if (this.state.isDragging) {
      const dx = event.clientX - this.state.previousX;
      const dy = event.clientY - this.state.previousY;
      this.setState((prevState) => ({
        previousX: event.clientX,
        previousY: event.clientY,
        offsetX: prevState.offsetX + dx / prevState.scale,
        offsetY: prevState.offsetY + dy / prevState.scale
      }));
    }
  };

  handleMouseUp = () => {
    this.setState({ isDragging: false });
  };

  render() {
    return (
      <div ref={this.mermaidContainerRef} className="mermaid-container">
        <div className="mermaid-zoom"
             style={{ transform: `scale(${this.state.scale})
                                  translate(${this.state.offsetX}px,
                                            ${this.state.offsetY}px)`}}>
          <div className="mermaid">{this.props.chart}</div>
        </div>
      </div>
    );
  }
}
