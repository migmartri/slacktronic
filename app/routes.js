// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/AppContainer';
import Home from './containers/HomeContainer';
import SlackConfig from './containers/SlackConfig';

export default () => (
  <App>
    <Switch>
      <Route path="/slack-config" component={SlackConfig} />
      <Route path="/" component={Home} />
    </Switch>
  </App>
);
