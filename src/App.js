import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ViewImage from './ViewImage';
import Upload from './Upload'
import Home from './Home';
import Login from './Login';
import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }
  constructor(props) {
    super();
  }

  componentWillMount(props) {
    const { cookies } = this.props;
    this.setState({
      user: cookies.get('user')
    })
  }
  render() {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/upload" component={Upload} />
        <Route path="/:imgId([0-9a-z]{5})" component={ViewImage} />
        <Route exact path="/" component={Home} />
        <Route>
          <h1>
            404
          </h1>
        </Route>
      </Switch>
    );
  }
}

export default withCookies(App);
