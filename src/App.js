import "./App.css";

import React from "react";
import Sidebar from "./widgets/Sidebar";
import Topbar from "./widgets/Topbar";
import PDFViewer from "./widgets/PDFViewer";
import DiagramViewer from "./widgets/DiagramViewer";
import CompareViewer from "./widgets/CompareViewer";

import createAlert from "./utilities/Alert";
import Themes from "./utilities/Themes.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfSrc: null,
      articleID: null,
      isLoading: false,
      selectedPresetIndex: 0,
      showPDFView: true,
      showDiagramView: true,
      showCompareView: false,
      diagramDefinition: null,
      summaryDefinition: null,
      compareDiagramDefinition: null,
      compareSummaryDefinition: null,
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
  changePDF = async (event) => {
    const file = event.target.files[0];
    // Check for PDF
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) { // 10MB in bytes
        createAlert('PDF file size exceeds 1MB.');
      } else {
        // Loading bar
        this.setIsLoading(true);

        // Get accountID / authentication token
        let accountID = localStorage.getItem("userId");
        let authToken = localStorage.getItem("authToken");

        // Send PDF to backend for diagram
        let articleID = await this.uploadPDF(file, accountID, authToken);
        // Check success
        if (articleID == null) {
          // No need for extra alert
          this.setIsLoading(false);
          return;
        }
        this.setState({ articleID: articleID });

        // Send article to server for diagram
        let diagram = await this.generateDiagram(accountID, articleID, authToken);
        // Check success
        if (diagram === null) {
          this.setIsLoading(false);
          return;
        }

        // Send article to server for sumamry
        let summary = await this.generateSummary(accountID, articleID, authToken);
        // Check success
        if (summary === null) {
          // No need for extra alert
          this.setIsLoading(false);
          return;
        }
        
        // Update views
        const reader = new FileReader();
        reader.onload = (e) => {
          this.setState({ pdfSrc: e.target.result });      
        };
        reader.readAsDataURL(file);
        this.setState({ diagramDefinition : diagram });
        this.setState({ summaryDefinition : summary });
        this.setIsLoading(false);
      }
    } else {
      createAlert('Please select a PDF file.');
    }
  };


  // Show pdf
  showPdf = (articleID, pdfSrc) => {
    console.log(pdfSrc);
    this.setState(
      {
        articleID: articleID,
        pdfSrc: pdfSrc
      },
      () => {
        // Callback function to handleRegenDiagram()
        this.handleRegenDiagram();
      }
    );
  }


  // Send PDF to backend to database
  uploadPDF = async (file, accountID, authToken) => {
    try {
      const formData  = new FormData();
      formData.append('pdf', file);
      // PDF upload endpoint
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/article`, {
        credentials: "include",
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: formData,
      });

      if (response.ok) {
        // Get article ID
        const data = await response.json()
        console.log("Data : ",data);
        const articleID = data.data.articleId;
        console.log("ArticleID : ", articleID);
        return articleID;
      } else {
        // Account not found
        if (response.status === 401) {
          createAlert('Uploading PDF : Unauthorized access!');
        // Too many tokens
        } else if (response.status === 413) {
          createAlert('Error uploading PDF file: PDF file exceeds 3500 tokens.');
        // All other errors
        } else {
          createAlert('Internal server error.');
          console.log("Error : ", response.status, response.statusText)
        }
        this.setIsLoading(false);
        return null;
      }
    } catch (error) {
      createAlert('Internal server error.');
      console.log("Error : ", error);
      this.setIsLoading(false);
      return null;
    }
  };


  // Generate diagram
  generateDiagram = async (accountID, articleID, authToken) => {
    try {
      // PDF to diagram  upload endpoint
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/visual/${articleID}/concept-map`, {
        credentials: "include",
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        // Recieve diagram as mermaid string
        const mermaid = await response.text();
        return mermaid;
      } else {
        // Account not found
        if (response.status === 401) {
          createAlert('Generate Diagram : Unauthorized access!');
        // All other errors
        } else {
          createAlert('Generate Diagram : Internal server error.');
          console.log("Generate Diagram Error : ", response.status, response.statusText)
        }
        this.setIsLoading(false);
        return null;
      }
    } catch (error) {
      createAlert('Generate Diagram : Internal server error.');
      console.log("Generate Diagram Error : ", error);
      this.setIsLoading(false);
      return null;
    }
  }


  // Generate summary
  generateSummary = async (accountID, articleID, authToken) => {
    try {
      // PDF to diagram upload endpoint
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/visual/${articleID}/summary`, {
        credentials: "include",
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
      });

      if (response.ok) {
        // Recieve summary as a string
        const summary = await response.text();
        return summary;
      } else {
        // Account not found
        if (response.status === 401) {
          createAlert('Generate Summary : Unauthorized access!');
        // All other errors
        } else {
          createAlert('Generate Summary : Internal server error.');
          console.log("Generate Summary Error : ", response.status, response.statusText)
        }
        this.setIsLoading(false);
        return null;
      }
    } catch (error) {
      createAlert('Generate Summary Internal server error.');
      console.log("Generate Summary Error : ", error);
      this.setIsLoading(false);
      return null;
    }
  }


  // Handle regenerate diagram from currently selected pdf
  handleRegenDiagram = async () => {
    if (this.state.articleID) {
      // Loading bar
      this.setIsLoading(true);
      
      // Get accountID / authentication token
      let accountID = localStorage.getItem("userId");
      let authToken = localStorage.getItem("authToken");

      // Send article to server for diagram
      let diagram = await this.updateDiagram(accountID, this.state.articleID, authToken);
      // Check success
      if (diagram === null) {
        this.setIsLoading(false);
        return;
      }

      // Send article to server for sumamry
      let summary = await this.updateSummary(accountID, this.state.articleID, authToken);
      // Check success
      if (summary === null) {
        // No need for extra alert
        this.setIsLoading(false);
        return;
      }

      // Update views
      this.setState({ diagramDefinition : diagram });
      this.setState({ summaryDefinition : summary });
      this.setIsLoading(false);
    } else {
      createAlert("No current PDF")
    }
  }


  // Update diagram
  updateDiagram = async (accountID, articleID, authToken) => {
    try {
      // Diagram update upload endpoint
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/visual/${articleID}/concept-map`, {
        credentials: "include",
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        // Successfully uploaded to backend
        const mermaid = await response.text();
        return mermaid;
      } else {
        // Account not found
        if (response.status === 401) {
          createAlert('Update Diagram : Unauthorized access!');
        // All other errors
        } else {
          createAlert('Update Diagram : Internal server error.');
          console.log("Update Diagram Error : ", response.status, response.statusText)
        }
        return null;
      }
    } catch (error) {
      createAlert('Update Diagram : Internal server error.');
      console.log("Update Diagram Error : ", error);
      return null;
    }
  }


  // Update sumamry
  updateSummary = async (accountID, articleID, authToken) => {
    try {
      // Summary update upload endpoint
      const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/visual/${articleID}/summary`, {
        credentials: "include",
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        // Successfully uploaded to backend
        const summary = await response.text();
        return summary;
      } else {
        // Account not found
        if (response.status === 401) {
          createAlert('Update Summary : Unauthorized access!');
        // All other errors
        } else {
          createAlert('Update Summary : Internal server error.');
          console.log("Update Summary Error : ", response.status, response.statusText)
        }
        return null;
      }
    } catch (error) {
      createAlert('Update Summary : Internal server error.');
      console.log("Update Summary Error : ", error);
      return null;
    }
  }


  // Save the PDF and diagram to local storage
  saveToLocal = (toggleRefresh) => {
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
        diagramDefinition: this.state.diagramDefinition,
        summaryDefinition: this.state.summaryDefinition,
        articleID: this.state.articleID
      };
      savedArticles.push(newArticle);

      localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
      toggleRefresh();
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
  loadArticle = (pdfSrc, diagramDefinition, summaryDefinition, articleID) => {
    if (pdfSrc && diagramDefinition) {
      if (this.state.showCompareView) {
        this.setState({
          pdfSrc: pdfSrc,
          compareDiagramDefinition: diagramDefinition,
          compareSummaryDefinition: summaryDefinition,
          articleID: articleID
        });
      } else {
        this.setState({
          pdfSrc: pdfSrc,
          diagramDefinition: diagramDefinition,
          summaryDefinition: summaryDefinition,
          articleID: articleID
        });
      }
    } else {
      console.log("Load issue :", pdfSrc);
      console.log("Diagram :", diagramDefinition);
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
    this.setState({
      showCompareView: false,
      showPDFView: !this.state.showPDFView
    })
  }


  // Shows/hides CompareView
  toggleCompareView = () => {
    this.setState({
      showPDFView: false,
      showCompareView: !this.state.showCompareView
    })
  }


  // Shows/hides DiagramView
  toggleDiagramView = () => {
    this.setState({ showDiagramView : !this.state.showDiagramView })
  }


  // Clears the PDF and Diagram views
  resetViews = () => {
    this.setState({
      pdfSrc: null,
      diagramDefinition: null,
      summaryDefinition: null,
      compareDiagramDefinition: null,
      compareSummaryDefinition: null
    });
  };

  render() {
    return (
      <div id="Fullscreen">
        <Sidebar onPDFChange={this.changePDF}
                 regenDiagram={this.handleRegenDiagram}
                 showPdf={this.showPdf}
                 onReset={this.resetViews}
                 togglePDF={this.togglePDFView}
                 toggleCompare={this.toggleCompareView}
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
            {this.state.showCompareView && (
              <CompareViewer diagramDefinition={this.state.compareDiagramDefinition}
                             summaryDefinition={this.state.compareSummaryDefinition} />
            )}
            {this.state.showDiagramView && (
              <DiagramViewer regenDiagram={this.handleRegenDiagram}
                             diagramDefinition={this.state.diagramDefinition}
                             summaryDefinition={this.state.summaryDefinition}
                             isLoading={this.state.isLoading}
                             saveToLocal={() => this.saveToLocal(this.toggleRefresh)} />
            )}
            {!this.state.showPDFView && !this.state.showDiagramView && !this.state.showCompareView && (
              <b>No Views Open :(</b>
            )}
          </div>
        </div>
      </div>
    );
  }
}
 
export default App;
