import React, { Component } from "react";
import Moment from "moment";
import { withCookies } from "react-cookie";
import "./App.css";
import "./ViewImage.css";

class ViewImage extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      imageData: null,
      imgLoadError: "",
      showImg: false
    };
  }
  componentDidMount() {
    var { cookies } = this.props;
    var api_key = cookies.get("user") ? cookies.get("user").api_key : null;
    fetch("http://i.evanlihou.com/api/getImage", {
      method: "POST",
      body: JSON.stringify({
        url: this.props.match.params.imgId,
        api_key: api_key
      }),
      headers: {
        "content-type": "application/json"
      }
    }).then(res => {
      res.json().then(data => {
        if (!res.ok) {
          this.setState({ imgLoadError: data.message, loading: false });
        } else {
          var created_date = new Moment(data.created_at);
          this.setState({
            imageData: data.image_data,
            created_at: created_date.format("MMM D, YYYY h:mm a"),
            created_by: data.username,
            private: data.is_private,
            loading: false
          });
          setTimeout(
            function() {
              this.setState({ showImg: true });
              console.log(this);
            }.bind(this),
            100
          );
        }
      });
    });
  }
  render() {
    return (
      <div className="ViewImagePage">
        {this.state.loading && <p>Loading...</p>}
        {this.state.imgLoadError && <p>{this.state.imgLoadError}</p>}
        {!this.state.loading &&
          !this.state.imgLoadError && (
            <div className="content">
              {this.state.private && <p>This image is private.</p>}
              <div className="mainImage">
                <img
                  src={this.state.imageData}
                  alt="User uploaded"
                  style={{ opacity: this.state.showImg ? 1 : 0 }}
                />
              </div>
              <div className="metadata">
                <div className="date">Uploaded: {this.state.created_at}</div>
                {this.state.created_by && (
                  <div className="user">{this.state.created_by}</div>
                )}
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default withCookies(ViewImage);
