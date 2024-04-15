import "./ArticleList.css";

import React from "react";
import createAlert from "../utilities/Alert";

import testArticles from "../testArticles.json"; // Test articles

class ArticleList extends React.Component {

  // Initializing state
  constructor(props) {
    super(props);
    this.state = {
      articles: []
    };
  }

  
  // Fetch articles when the component mounts
  // Change to onlogin later on
  componentDidMount() {
    this.setState({ articles: testArticles });
    /*
    fetch("../testArticles.json") // Temporary json testing, possibly allow local storage?
      .then(response => response.json())
      .then(data => {
        this.setState({ articles: data });
      })
      .catch(error => {
        createAlert("Error fetching articles: " + error);
      });
      */
  }


  render() {
    return (
      <div id="Article-list">
        <ul>
          {this.state.articles.map(article => (
            <li key={article.ArticleID} id="Article-item">
              <button onClick={() => console.log("Article clicked:", article)} id="Article-button">
                <div id="Article-title">{article.Title}</div>
                <div id="Article-id">{"UUID : " + article.StorageArticleUUID}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ArticleList;