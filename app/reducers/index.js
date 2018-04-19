// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import slack from './slack';
import subscriptions from './subscriptions';

const rootReducer = combineReducers({
  slack,
  subscriptions,
  router,
});

export default rootReducer;
