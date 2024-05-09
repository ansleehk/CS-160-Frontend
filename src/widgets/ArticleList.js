import "./ArticleList.css";

import React from "react";
import createAlert from "../utilities/Alert";
import Tooltip from "../utilities/Tooltip";

import del from "../images/Delete.png";

class ArticleList extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      localArticles: [],
      serverArticles: []
    };
  }

  
  // Fetch articles when the component mounts
  // Change to onlogin later on
  componentDidMount = async () => {
    await this.fetchArticles();
  }


  // Fetch article force update
  componentDidUpdate(prevProps) {
    // Check if the bTriggered prop has changed
    if (this.props.toggleRefresh && !prevProps.toggleRefresh) {
      this.fetchArticles();
    }
  }

  
  // Fetch and load articles from local/server
  fetchArticles = async() => {
    // Get local articles from local storage
    const localArticles = this.loadFromLocal();

    // Get server articles from server
    //const serverArticles = testArticles;
    const serverArticles = await this.fetchArticleList()
    
    // Update state article lists
    this.setState({
      localArticles: localArticles,
      serverArticles: serverArticles
    });
  }


  // Return decompressed articles from local storage
  loadFromLocal = () => {
    const savedArticles = localStorage.getItem('savedArticles');
    if (savedArticles) {
      return JSON.parse(savedArticles);
    } else {
      return [];
    }
  };


  // Return article/diagram from server
  loadFromServer = async (articleID) => {
    // Get accountID / authentication token
    let accountID = localStorage.getItem("userId");
    let authToken = localStorage.getItem("authToken");

    let article = await this.fetchServerArticle(accountID, articleID, authToken);
    if (article === null) { return; }
    console.log(article);
    //console.log(URL.createObjectURL(article));
    //const blob = this.base64toBlob(article.text());
    //const url = URL.createObjectURL(blob);
    const blob = await article.blob();
    const url = URL.createObjectURL(blob);

    this.props.showPdf(articleID, url);

    /*
    let diagram = await this.fetchServerDiagram(accountID, articleID, authToken);
    if (diagram === null) { return; }
    let summary = await this.fetchServerSummary(accountID, articleID, authToken);
    if (summary === null) { return; }

    this.props.loadArticle(this.convertToPdfSrc(article), diagram, summary)    
    */
  }

  base64toBlob = (data) => {
    if (typeof data !== 'string') {
      console.error('Input data is not a string.');
      return null;
    }

    // Check if the prefix is present
    const prefix = 'data:application/pdf;base64,';
    if (data.startsWith(prefix)) {
        // Remove the prefix
        data = data.substr(prefix.length);
    }

    // Convert base64 to binary
    const bytes = atob(data);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
        out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: 'application/pdf' });
};


  // Convert PDF file binary string to pdfSrc
  convertToPdfSrc = (pdfFileString) => {
    const pdfBlob = new Blob([pdfFileString], { type: 'application/pdf' });
    const reader = new FileReader();
    reader.onload = (e) => {
      return e.target.result;      
    };
    reader.readAsDataURL(pdfBlob);
    /*
    const pdfDataUrl = `data:application/pdf;base64,${btoa(pdfFileString)}`;
    console.log(pdfDataUrl);
    return pdfDataUrl;
    */
  }


  // Get article list from server
  fetchArticleList = async () => {
    // Get user id / authentication token
    let accountID = localStorage.getItem("userId") || null;
    let authToken = localStorage.getItem("authToken");

    // Not logged in
    if (accountID === null) {
      return [];
    }

    // Fetch article list
    const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/article`, {
      credentials: "include",
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      },
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access article list!");
      return [];
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing article list.');
      console.log("Error : ", response.status, response.statusText)
      return [];
    }

    const data = await response.json();
    return data.data.articles;
  }


  // Fetch article from server
  fetchServerArticle = async (accountID, articleID, authToken) => {
    // Fetch article
    const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/article/${articleID}`, {
      credentials: "include",
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access article!");
      return null;
    }

    // Error : Article not found!
    if (response.status === 404) {
      createAlert("Selected article can't be found.");
      return null;
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing article list.');
      console.log("Error : ", response.status, response.statusText)
      return null;
    }

    const responseBody = await response;
    return responseBody;
  }


  // Fetch diagram from server
  fetchServerDiagram = async (accountID, articleID, authToken) => {
    // Fetch Diagram
    const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/visual/${articleID}/concept-map`, {
      credentials: "include",
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access diagram!");
      return null;
    }

    // Error : Article not found!
    if (response.status === 404) {
      createAlert("Selected diagram can't be found.");
      return null;
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing diagram.');
      console.log("Error : ", response.status, response.statusText)
      return null;
    }

    const responseBody = await response;
    return responseBody;
  }


  // Fetch summary from server
  fetchServerSummary = async (accountID, articleID, authToken) => {
    // Fetch Summary
    const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/visual/${articleID}/summary`, {
      credentials: "include",
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access summary!");
      return null;
    }

    // Error : Article not found!
    if (response.status === 404) {
      createAlert("Selected sumary can't be found.");
      return null;
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing summary.');
      console.log("Error : ", response.status, response.statusText)
      return null;
    }

    const responseBody = await response;
    return responseBody;
  }


  // Cut down the summary to 100char or 2 new lines
  truncateSummary = (summary) => {
    var text = summary;
    // Splitting the summary by newline character and taking at most two lines
    const lines = text.split('\n');
    if (lines.length > 2) {
      text = lines.slice(0, 2).join('\n') + '...';
    }
    // Cutting down to 100 chars
    if (text.length > 100) {
      text = text.substring(0, 100) + '...';
    }
    return text;
  };


  // Delete article from server
  deleteFromServer = async (article, articleID) => {
    // Get accountID / authentication token
    let accountID = localStorage.getItem("userId");
    let authToken = localStorage.getItem("authToken");

    // Delete article
    const response = await fetch(`https://hdbnlbixq2.execute-api.us-east-1.amazonaws.com/account/${accountID}/article/${articleID}`, {
      credentials: "include",
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access diagram!");
      return;
    }

    // Error : Article not found!
    if (response.status === 404) {
      createAlert("Selected diagram can't be found.");
      return;
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing diagram.');
      console.log("Error : ", response.status, response.statusText)
      return;
    }

    createAlert("Article deleted!");
  }


  render() {
    return (
      <div key={this.props.toggleRefresh} id="Article-list">
        <b>Local Articles</b>
        <ul>
          {this.state.localArticles && this.state.localArticles.map((article, index) => (
            <li key={index} className="Article-item" onClick={() => this.props.loadArticle(article.pdfSrc, article.diagramDefinition, article.summaryDefinition, article.articleID)}>
              <div className="Article-title">{article.title}</div>
              <div className="Article-summary">{this.truncateSummary(article.summaryDefinition)}</div>
              <Tooltip className="Delete-tooltip" text="Delete from local storage">
                <button onClick={() => this.props.deleteFromLocal(index)}
                  className="Article-delete-button">
                <img src={del} alt="delete article" />
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
        <b>Server Articles</b>
        <ul>
          {this.state.serverArticles.map(article => (
            <li key={article.articleID} className="Article-item" onClick={() => this.loadFromServer(article.articleID)}>
              <div className="Article-title">{article.title}</div>
              <div className="Article-summary">{this.truncateSummary(article.summary)}</div>
              <Tooltip className="Delete-tooltip" text="Delete from server storage">
                <button onClick={(e) => {
                  e.stopPropagation();
                  this.deleteFromServer(article, article.articleID); }}
                  className="Article-delete-button">
                <img src={del} alt="delete article" />
                </button>
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ArticleList;