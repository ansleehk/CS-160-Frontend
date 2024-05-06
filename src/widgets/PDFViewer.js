import "./PDFViewer.css";

import React from "react";
import Tooltip from "../utilities/Tooltip";

import upload from "../images/Upload.png";

class PDFViewer extends React.Component {
  render() {
    return (
      <div id="PDF-viewer" data-testid="PDFViewer">
        {this.props.pdfSrc ? (
          // Render PDF if pdfSrc available
          <embed src={this.props.pdfSrc} type="application/pdf" width="100%" height="100%" />
        ) : (
          // Upload PDF button
          <div id="Upload">
            <p>Upload PDF</p>
            <Tooltip text="Upload PDF for diagram generation">
              <button onClick={() => document.getElementById("PDF-input").click()}>
                <img src={upload} id="Upload" alt="upload" />
              </button>
            </Tooltip>
            {/* Input only accepts PDF files */}
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