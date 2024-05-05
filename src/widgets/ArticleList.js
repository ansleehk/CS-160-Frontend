import "./ArticleList.css";

import React from "react";
import createAlert from "../utilities/Alert";

import del from "../images/Delete.png";
// import testArticles from "../testArticles.json"; // Test articles

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
    // Get user id
    // TODO

    let article = await this.fetchServerArticle(accountID, articleID);
    let diagram = await this.fetchServerDiagram(accountID, articleID);
    this.props.loadArticle(article, diagram)    
  }


  // Get article list from server
  fetchArticleList = async () => {
    // Get user id
    // TODO

    // Fetch article list
    const response = await fetch('/account/${accountId}/article', {
      method: 'GET'
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

    const responseBody = await response.result();
    return responseBody;
  }


  // Fetch article from server
  fetchServerArticle = async (accountID, articleID) => {
    // TODO : Fix returns

    // Fetch article
    const response = await fetch('/account/${accountId}/article/${articleID}', {
      method: 'GET'
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access article!");
      return false;
    }

    // Error : Article not found!
    if (response.status === 404) {
      createAlert("Selected article can't be found.");
      return false;
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing article list.');
      console.log("Error : ", response.status, response.statusText)
      return false;
    }

    const responseBody = await response.text();
    return responseBody;
  }


  // Fetch diagram from server
  fetchServerDiagram = async (accountID, articleID) => {
    // Fetch Diagram
    const response = await fetch('/account/${accountId}/visual/${articleID}/concept-map', {
      method: 'GET'
    });

    // Error : Access unauthorized
    if (response.status === 401) {
      createAlert("Can't access diagram!");
      return "";
    }

    // Error : Article not found!
    if (response.status === 404) {
      createAlert("Selected diagram can't be found.");
      return "";
    }

    // Error : Internal server error
    if (!response.ok) {
      createAlert('Internal server error when accessing diagram.');
      console.log("Error : ", response.status, response.statusText)
      return "";
    }

    const responseBody = await response.text();
    return responseBody;
  }



  render() {
    return (
      <div key={this.props.toggleRefresh} id="Article-list">
        <b>Local Articles</b>
        <ul>
          {this.state.localArticles && this.state.localArticles.map((article, index) => (
            <li key={index} className="Article-item">
              <button onClick={() => this.props.loadArticle(article.pdfSrc, article.diagramDefinition)} 
                      className="Article-button">
                <div className="Article-title">Title</div>
                <div className="Article-id">Description</div>
                <button onClick={() => this.props.deleteFromLocal(index)}
                        className="Article-delete-button">
                  <img src={del} alt="delete article" />
                </button>
              </button>
            </li>
          ))}
        </ul>
        <b>Server Articles</b>
        <ul>
          {this.state.serverArticles.map(article => (
            <li key={article.ArticleID} className="Article-item">
              <button onClick={() => this.loadFromServer(key)} 
                      className="Article-button">
                <div className="Article-title">{article.title}</div>
                <div className="Article-summary">{article.summary}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ArticleList;