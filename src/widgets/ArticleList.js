import "./ArticleList.css";

import React from "react";
// import createAlert from "../utilities/Alert";

import testArticles from "../testArticles.json"; // Test articles

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
  componentDidMount() {
    // Get local articles from local storage
    const localArticlesData = localStorage.getItem('savedArticles');
    const localArticles = localArticlesData ? JSON.parse(localArticlesData) : [];

    console.log('Local articles:', localArticles);

    // Update state with local articles and test articles
    this.setState({
      localArticles: localArticles,
      serverArticles: testArticles
    });
    /*
    fetch("../testArticles.json") // Temporary json testing, possibly allow local storage?
      .then(response => response.json())
      .then(data => {
        this.setState({ serverArticles: data });
      })
      .catch(error => {
        createAlert("Error fetching articles: " + error);
      });
      */
  }

  render() {
    return (
      <div id="Article-list">
        <b>Local Articles</b>
        <ul>
          {this.state.localArticles.map(article => (
            <li key={article.ArticleID} className="Article-item">
              <button onClick={() => this.props.loadArticle(article.pdfSrc, article.diagramDefinition)} 
                      className="Article-button">
                <div className="Article-title">Title</div>
                <div className="Article-id">Description</div>
              </button>
            </li>
          ))}
        </ul>
        <b>Server Articles</b>
        <ul>
          {this.state.serverArticles.map(article => (
            <li key={article.ArticleID} className="Article-item">
              <button onClick={() => console.log("Article clicked:", article)} 
                      className="Article-button">
                <div className="Article-title">{article.Title}</div>
                <div className="Article-id">{"UUID : " + article.StorageArticleUUID}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ArticleList;