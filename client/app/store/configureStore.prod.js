// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import rootSaga from '../rootSaga';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware, router);

function configureStore() {
  const store = createStore(rootReducer, enhancer);
  sagaMiddleware.run(rootSaga);
  return store;
}

export default { configureStore, history };
