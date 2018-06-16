import React, { Component } from 'react';
import './App.css';

class Home extends Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      imageData: null,
      imgLoadError: ""
    }
  }
  componentDidMount() {
    
  }
  render() {
    return (
      <div className="HomePage">
        Home
      </div>
    );
  }
}

export default Home;
