// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import slack from './slack';
import subscriptions from './subscriptions';
import serial from './serial';
import providers from './providers';


const rootReducer = combineReducers({
  slack,
  subscriptions,
  serial,
  router,
  providers,
});

export default rootReducer;
