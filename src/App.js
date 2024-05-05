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
      showPDFView: true,
      showDiagramView: true,
      diagramDefinition: null,
      toggleRefresh: false,
    };
  }


  componentDidMount() {
    this.loadThemeColors();
  }


  // Load previously selected theme from local storage
  loadThemeColors() {
    const storedPresetIndex = localStorage.getItem("selectedPresetIndex");
    if (storedPresetIndex !== null) {
      this.setState({ selectedPresetIndex: parseInt(storedPresetIndex) });
    }
    const presetColors = Themes[this.state.selectedPresetIndex].colors;

    // Settings each of the color variables
    Object.keys(presetColors).forEach((name) => {
      const storedColor = localStorage.getItem(name);
      const color = storedColor || presetColors[name];
      document.documentElement.style.setProperty(`--${name}`, color);
    });
  }

  
  // Handler for pdf upload
  changePDF = (event) => {
    const file = event.target.files[0];
    // Check for PDF
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Show PDF on screen
        this.setState({ pdfSrc: e.target.result });
        // Send PDF to backend for diagram
        this.uploadPDF(file);
      };
      reader.readAsDataURL(file);
    } else {
      createAlert('Please select a PDF file.');
    }
  };

  // Send PDF to backend for diagram
  uploadPDF = async (file) => {
    try {
      this.setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
  
      // PDF upload endpoint
      const response = await fetch('/uploadPdf', {
        method: 'POST',
        body: formData
      });
  
      if (response.status === 413) {
        createAlert('Error uploading PDF file: PDF file exceeds 3500 tokens.');
        this.setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to upload PDF file');
      }
  
      const responseBody = await response.text();
      console.log('PDF file uploaded successfully:', responseBody);
      this.setIsLoading(false);

      // Update diagram
      this.changeDiagram(responseBody);
    } catch (error) {
      console.log('Error uploading PDF file:', error.message); 
      createAlert('Error uploading PDF file: ' + error.message);
      this.setIsLoading(false);
    }
  };


  // Regenerate diagram from pdf
  regenDiagram = async () => {
    if (this.state.pdfSrc) {
      try {
        // Convert data URI to PDF file
        const blob = await (await fetch(this.state.pdfSrc)).blob();
        const file = new File([blob], "filename.pdf", { type: "application/pdf" });
        await this.uploadPDF(file);
      } catch (error) {
        console.error("Error regenerating diagram:", error);
        createAlert("Error regenerating diagram. Please try again.");
      }
    } else {
      createAlert("No current PDF")
    }
  }


  // Save the PDF and diagram to local storage
  saveToLocal = () => {
    if (this.state.pdfSrc && this.state.diagramDefinition) {

      // Get existing data from local storage
      let savedArticles = localStorage.getItem('savedArticles');
      if (savedArticles) {
        savedArticles = JSON.parse(savedArticles);
      } else {
        savedArticles = [];
      }

      // Combine new data with existing data
      const newArticle = {
        pdfSrc: this.state.pdfSrc,
        diagramDefinition: this.state.diagramDefinition
      };
      savedArticles.push(newArticle);

      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      this.toggleRefresh();
      createAlert("PDF and Diagram saved to local storage.");
    } else {
      createAlert("Both PDF and diagram must be present to save to local storage.");
    }
  };


  // Delete an article from local storage
  deleteFromLocal = (articleIndex) => {
    let updatedArticles = JSON.parse(localStorage.getItem('savedArticles')) || [];
    updatedArticles.splice(articleIndex, 1);
    localStorage.setItem('savedArticles', JSON.stringify(updatedArticles));
    this.toggleRefresh();
    
    createAlert("PDF and Diagram removed from local storage.")
  };


  // Load an article from local/server list
  loadArticle = (pdfSrc, diagramDefinition) => {
    if (pdfSrc && diagramDefinition) {
      this.setState({
        pdfSrc: pdfSrc,
        diagramDefinition: diagramDefinition
      });
    } else {
      createAlert("PDF/Diagram information could not be retrieved.")
    }
  }


  // Reload the article list
  toggleRefresh = () => {
    this.setState({ toggleRefresh: !this.state.toggleRefresh });
  };


  // Whether to show loading wheel
  setIsLoading = (isLoading) => {
    this.setState({ isLoading });
  };


  // Changes the embeded diagram
  changeDiagram(diagram) {
    this.setState({ diagramDefinition: diagram });
  }


  // Shows/hides PDFView
  togglePDFView = () => {
    this.setState({ showPDFView : !this.state.showPDFView })
  }

  // Shows/hides DiagramView
  toggleDiagramView = () => {
    this.setState({ showDiagramView : !this.state.showDiagramView })
  }


  // Clears the PDF and Diagram views
  resetViews = () => {
    this.setState({ pdfSrc: null, diagramDefinition: null });
  };

  render() {
    return (
      <div id="Fullscreen">
        <Sidebar onPDFChange={this.changePDF}
                 regenDiagram={this.regenDiagram}
                 onReset={this.resetViews}
                 togglePDF={this.togglePDFView}
                 toggleDiagram={this.toggleDiagramView}
                 loadArticle={this.loadArticle}
                 deleteFromLocal={this.deleteFromLocal}
                 toggleRefresh={this.state.toggleRefresh} />
        <div id="Main">
          <Topbar/>
          <div id="Views">
            {this.state.showPDFView && (
              <PDFViewer onPDFChange={this.changePDF}
                         pdfSrc={this.state.pdfSrc} />
            )}
            {this.state.showDiagramView && (
              <DiagramViewer regenDiagram={this.regenDiagram}
                             diagramDefinition={this.state.diagramDefinition}
                             isLoading={this.state.isLoading}
                             saveToLocal={this.saveToLocal} />
            )}
            {!this.state.showPDFView && !this.state.showDiagramView && (
              <b>No Views Open :(</b>
            )}
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
