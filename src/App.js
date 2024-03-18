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
    alert("Hi");
    const formData = new FormData();
    formData.append('file', file);

    // Local : http://localhost:8080/uploadPdf
    // AWS : https://d1doi45x0nyjfu.cloudfront.net:443/uploadPdf
  
    /*
    const response = await fetch('https://d1doi45x0nyjfu.cloudfront.net:443/uploadPdf', {
      method: 'POST',
      body: formData
    });
    */

    try {
      const response = await fetch('https://d1doi45x0nyjfu.cloudfront.net:443/uploadPdf', {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      console.log("Download complete", response);
      const responseBody = await response.text();
      console.log('Response:', responseBody);
    } catch (error) {
      console.error("Download error:", error.message);
    }
  
  
    /*
    if (!response.ok) {
      throw Utilities.showError(`Failed to upload PDF file: ${response.status} - ${response.statusText}`);
    }
  
    const data = await response.json();
    Utilities.showError('PDF file uploaded successfully:' + data);
    // Optionally, handle the response data
    */
  };

  render() {
    return (
      <div id="Fullscreen">
        <Sidebar onPDFChange={this.changePDF} />
        <div id="Main">
          <Topbar/>
          <div id="Views">  
            <PDFViewer onPDFChange={this.changePDF}
                       pdfSrc={this.state.pdfSrc} />
            <DiagramViewer/>
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
