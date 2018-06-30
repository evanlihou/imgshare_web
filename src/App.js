import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { PropTypes, instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import ViewImage from "./ViewImage";
import Upload from "./Upload";
import Root from "./Root";
import Login from "./Login";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

class App extends Component {
  static contextTypes = {
    router: PropTypes.object
  };
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  componentWillMount(props) {
    const { cookies } = this.props;
    let userData = cookies.get("user")
    if (userData) {
      userData = decodeURI(userData)
      userData = atob(userData)
      this.setState({
        user: userData
      });
    }
  }
  render() {
    return (
      <div className="app">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/upload" component={Upload} />
          <Route path="/:imgId([0-9a-z]{5})" component={ViewImage} />
          <Route exact path="/" component={Root} />
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withCookies(App);
