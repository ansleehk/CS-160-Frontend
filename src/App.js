import "./App.css";
import React from "react";
import Sidebar from "./widgets/Sidebar";
import Topbar from "./widgets/Topbar";
import PDFViewer from "./widgets/PDFViewer";
import DiagramViewer from "./widgets/DiagramViewer";
import Utilities from "./Utilities";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfSrc: null
    };
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
      Utilities.showError('Please select a PDF file.');
    }
  };

  uploadPDF = async (file) => {
    try {
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
        Utilities.showError('PDF file exceeds 3500 tokens.');
      }

      if (!response.ok) {
        throw new Error('Failed to upload PDF file');
      }
  
      const responseBody = await response.text();
      console.log('PDF file uploaded successfully:', responseBody);
    } catch (error) {
      console.error('Error uploading PDF file:', error.message);
    }
  };

  changeDiagram(diagram) {
    this.setState({ diagramDefinition: diagram });
  }

  render() {
    return (
      <div id="Fullscreen">
        <Sidebar onPDFChange={this.changePDF} />
        <div id="Main">
          <Topbar/>
          <div id="Views">  
            <PDFViewer onPDFChange={this.changePDF}
                       pdfSrc={this.state.pdfSrc} />
            <DiagramViewer diagramDefinition={this.state.diagramDefinition}/>
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
