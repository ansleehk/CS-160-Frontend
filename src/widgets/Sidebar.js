import "./Sidebar.css";

import React from "react";
import createAlert from "../utilities/Alert";

import sidebar from "../images/Sidebar.png";
import upload from "../images/Upload.png";
import generate from "../images/Generate.png";
import testArticles from "../testArticles.json"; // Test articles

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
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

  toggleSidebar = () => {
    this.setState((prevState) => ({
      sidebarOpen: !prevState.sidebarOpen
    }));
  };

  render() {
    return (
      <div id="Sidebar" data-testid="Sidebar">
        { this.state.sidebarOpen ? (
          <div id="Open-sidebar">
            <div id="Open-sidebar-top">
              <b>Saved Articles</b>
              <button onClick={() => this.toggleSidebar()}>
                <img src={sidebar} id="Sidebar-close" alt="close sidebar"
                  style={{ transform: 'rotate(180deg)' }} />
              </button>
            </div>
            <div id="article-list">
              <ul>
                {this.state.articles.map(article => (
                  <li key={article.ArticleID} id="article-item">
                    <button onClick={() => console.log("Article clicked:", article)} id="article-button">
                      <div id="article-title">{article.Title}</div>
                      <div id="article-id">{"UUID : " + article.StorageArticleUUID}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div id="Closed-sidebar">
            <div id="Closed-sidebar-top">
              <button onClick={() => this.toggleSidebar()}>
                <img src={sidebar} id="Sidebar-open" alt="open sidebar" />
              </button>
            </div>
            <button onClick={() => document.getElementById("PDF-input").click()}>
              <img src={upload} id="Upload" alt="upload" />
            </button>
            <input id="PDF-input" type="file" accept=".pdf"
              onChange={this.props.onPDFChange}
              style={{ display: "none" }}/>
            <button onClick={() => createAlert('Regenerate Diagram not implemented!')}>
              <img src={generate} id="Generate" alt="generate" />
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;