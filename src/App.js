import "./App.css";

import React from "react";
import Sidebar from "./widgets/Sidebar";
import Topbar from "./widgets/Topbar";
import PDFViewer from "./widgets/PDFViewer";
import DiagramViewer from "./widgets/DiagramViewer";

import createAlert from "./utilities/Alert";
import Themes from "./utilities/Themes.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfSrc: null,
      isLoading: false,
      selectedPresetIndex: 0,
    };
  }

  componentDidMount() {
    const storedPresetIndex = localStorage.getItem("selectedPresetIndex");
    if (storedPresetIndex !== null) {
      this.setState({ selectedPresetIndex: parseInt(storedPresetIndex) });
    }
    this.applyThemeColors();
  }

  applyThemeColors() {
    const presetColors = Themes[this.state.selectedPresetIndex].colors;
    Object.keys(presetColors).forEach((name) => {
      const storedColor = localStorage.getItem(name);
      const color = storedColor || presetColors[name];
      document.documentElement.style.setProperty(`--${name}`, color);
    });
  }

  changePDF = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ pdfSrc: e.target.result });
        this.uploadPDF(file);
      };
      reader.readAsDataURL(file);
    } else {
      createAlert('Please select a PDF file.');
    }
  };

  uploadPDF = async (file) => {
    try {
      this.setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Local : http://localhost:8080/uploadPdf
      // AWS : https://d1doi45x0nyjfu.cloudfront.net:443/uploadPdf
      // Currently using local w/ proxy
  
      const response = await fetch('/uploadPdf', {
        method: 'POST',
        body: formData
      });
  
      if (response.status === 413) {
        createAlert('PDF file exceeds 3500 tokens.');
      }

      if (!response.ok) {
        throw new Error('Failed to upload PDF file');
      }
  
      const responseBody = await response.text();
      console.log('PDF file uploaded successfully:', responseBody);
      this.setIsLoading(false);
      this.changeDiagram(responseBody);
    } catch (error) {
      console.log('Error uploading PDF file:', error.message); 
      createAlert('Error uploading PDF file: ' + error.message);
      this.setIsLoading(false);
    }
  };

  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  };

  changeDiagram(diagram) {
    this.setState({ diagramDefinition: diagram });
  }

  resetViews = () => {
    this.setState({ pdfSrc: null, diagramDefinition: null });
  };

  render() {
    return (
      <div id="Fullscreen">
        <Sidebar onPDFChange={this.changePDF}
                 onReset={this.resetViews} />
        <div id="Main">
          <Topbar/>
          <div id="Views">  
            <PDFViewer onPDFChange={this.changePDF}
                       pdfSrc={this.state.pdfSrc} />
            <DiagramViewer diagramDefinition={this.state.diagramDefinition}
                           isLoading={this.state.isLoading}/>
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
