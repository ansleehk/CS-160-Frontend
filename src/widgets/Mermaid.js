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
  }

  componentDidMount() {
    mermaid.contentLoaded();
    window.addEventListener("wheel", this.handleWheel, { passive: false });
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
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
      <div className="mermaid-container">
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
