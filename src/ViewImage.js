import React, { Component } from 'react';
import './App.css';

class ViewImage extends Component {
  constructor() {
    super()
    this.state = {
      loading: true,
      imageData: null,
      imgLoadError: ""
    }
  }
  componentDidMount() {
    fetch('http://localhost:8000/getImage/'+this.props.match.params.imgId).then(res => {
      res.json().then(data => {
        if (res.status !== 200) {
          this.setState({imgLoadError: data.message, loading: false})
          console.log(data, res)
        } else {
          this.setState({imageData: data.image_data, loading: false})
          console.log(data.image_data)
        }
      })
    })
  }
  render() {
    return (
      <div className="ViewImagePage">
        {this.state.loading && <p>Loading...</p>}
        {this.state.imgLoadError && <p>{this.state.imgLoadError}</p>}
        {!this.state.loading && !this.state.imgLoadError && <img src={this.state.imageData} />}
      </div>
    );
  }
}

export default ViewImage;
