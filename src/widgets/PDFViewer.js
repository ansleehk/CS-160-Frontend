import "./PDFViewer.css";

import React from "react";
import Utilities from "../Utilities";

import upload from "../images/Upload.png";

class PDFViewer extends React.Component {
  render() {
    return (
      <>
        <div id="PDF-viewer">
          <p>Upload PDF</p>
          <button onClick={() => Utilities.showError('Upload PDF not implemented!')}>
            <img src={upload} id="Upload" alt="upload" />
          </button>
        </div>
      </>
    );
  }
}

export default PDFViewer;