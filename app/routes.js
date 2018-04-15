/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import SlackConfig from './containers/SlackConfig';

export default () => (
  <App>
    <Switch>
      <Route path="/slack-config" component={SlackConfig} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
