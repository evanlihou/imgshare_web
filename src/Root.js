import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { withCookies } from "react-cookie";
import "./App.css";

class Root extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      imageData: null,
      imgLoadError: ""
    };
  }
  componentDidMount() {
    var { cookies } = this.props;
    console.log(cookies.get("user") === undefined);
    this.setState({
      authenticated: !(cookies.get("user") === undefined)
    });
  }

  render() {
    return (
      <div className="RootPage">
        {this.state.authenticated === false && <Redirect to="/login" push />}
        {this.state.authenticated === true && <Redirect to="/upload" push />}
      </div>
    );
  }
}

export default withCookies(Root);
