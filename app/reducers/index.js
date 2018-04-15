// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import slack from './slack';

const rootReducer = combineReducers({
  slack,
  router,
});

export default rootReducer;
