// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/AppContainer';
import Home from './containers/HomeContainer';
import SlackConfigContainer from './containers/SlackConfigContainer';

export default () => (
  <App>
    <Switch>
      <Route path="/slack-config-manual" component={SlackConfigContainer()} />
      <Route path="/slack-config" component={SlackConfigContainer({ easyOnboarding: true })} />
      <Route path="/" component={Home} />
    </Switch>
  </App>
);
