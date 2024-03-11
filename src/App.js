import "./App.css";
import React from "react";
import Sidebar from "./widgets/Sidebar";
import Topbar from "./widgets/Topbar";
import PDFViewer from "./widgets/PDFViewer";
import DiagramViewer from "./widgets/DiagramViewer";

class App extends React.Component {
  /*
  constructor(props) {
    super(props);
  }
  */

  render() {
    return (
      <div id="Fullscreen">
        <Sidebar/>
        <div id="Main">
          <Topbar/>
          <div id="Views">  
            <PDFViewer/>
            <DiagramViewer/>
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
