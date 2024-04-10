import "./PDFViewer.css";

import React from "react";

import upload from "../images/Upload.png";

class PDFViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfSrc: null
    };
  }

  render() {
    return (
      <div id="PDF-viewer" data-testid="PDFViewer">
        {this.props.pdfSrc ? (
          <embed src={this.props.pdfSrc} type="application/pdf" width="100%" height="100%" />
        ) : (
          <div id="Upload">
            <p>Upload PDF</p>
            <button onClick={() => document.getElementById("PDF-input").click()}>
              <img src={upload} id="Upload" alt="upload" />
            </button>
            <input id="PDF-input" type="file" accept=".pdf"
              onChange={this.props.onPDFChange}
              style={{ display: "none" }}/>
          </div>
        )}
      </div>
    );
  }
}

export default PDFViewer;