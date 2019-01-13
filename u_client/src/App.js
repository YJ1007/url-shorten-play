import React, { Component } from 'react';
import './App.css';

const END_POINT = "http://localhost:8082/";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      sUrl: "",
      error: "",
    };
    this.url = ""
  }

  shortenUrl = (url) => {
    if(!url.length){
      this.setState({error: "no url provided to shorten"});
      return;
    }

    PostReq(END_POINT + "shorten", {url: url}, (res) => {
      try{
        var resp = JSON.parse(res.response);
        if(res.status == 200){
          var shortCode = resp.data.sid;
          this.setState({sUrl: END_POINT + ":" + shortCode, error: ""});
        }
        else
          this.setState({error: resp.data});
      }
      catch(e){
        console.log("parse error", e);
      }
    });
  }

  render() {
    return (
      <div className="App">
        <header>
          <p>URL SHORTEN EXAMPLE</p>
        </header>
        <input placeholder="Link to shorten" onChange={(e) => this.url = e.target.value }/>
        <button type="button" onClick={() => this.shortenUrl(this.url)} style={{margin: 10}}>Shorten</button>
        <p>Shortened Link: <a className="App-link" href={this.state.sUrl} target="_blank" rel="noopener noreferrer">{this.state.sUrl}</a></p>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

export default App;

function GetReq(url, cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.withCredentials = true;
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4)
     cb(this);
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function PostReq(url, params, cb){
  var xhttp = new XMLHttpRequest();
  xhttp.withCredentials = true;
  var data = JSON.stringify(params);
  xhttp.open("POST", url, true);
  xhttp.onreadystatechange = function(){
    if(this.readyState === 4) cb(this);
  }
  xhttp.send(data);
}
