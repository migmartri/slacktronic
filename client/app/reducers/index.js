// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import slack from './slack';
import subscriptions from './subscriptions';
import actions from './actions';
import triggers from './triggers';
import serial from './serial';
import providers from './providers';
import app from './app';


const rootReducer = combineReducers({
  slack,
  subscriptions,
  serial,
  actions,
  triggers,
  router,
  providers,
  app
});

export default rootReducer;
