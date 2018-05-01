// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import actionsSaga from '../integrations/actions/';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware, thunk, router);

function configureStore() {
  const store = createStore(rootReducer, enhancer);
  sagaMiddleware.run(actionsSaga);
  return store;
}

export default { configureStore, history };
