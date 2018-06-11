import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import ViewImage from './ViewImage'
import './App.css';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/:imgId" component={ViewImage} />
      </Switch>
    );
  }
}

export default App;
