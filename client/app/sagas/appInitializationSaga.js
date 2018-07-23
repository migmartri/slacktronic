import { takeEvery, all, put } from 'redux-saga/effects';
import Store from 'electron-store';
import actionTypes from '../actions/actionTypes';
import * as providerActions from '../actions/providers';
import { AVAILABLE_PROVIDERS } from '../integrations';

const configStore = new Store();
const debug = require('debug')('slacktronic@appInit.saga');

function* initializeApp() {
  debug('Initializating application');

  try {
    const token = configStore.get('slack.token');
    if (token) {
      yield put(providerActions.initialize(AVAILABLE_PROVIDERS.slack, { token }));
    }

    yield put(providerActions.initialize(AVAILABLE_PROVIDERS.serialCom));
    yield put({ type: actionTypes.STORE_SNAPSHOT_RETRIEVE });
    yield put({ type: actionTypes.APP_INITIALIZED });
    debug('App initialized');
  } catch (err) {
    debug('App initialization failed %o', err);
    yield put({ type: actionTypes.APP_INITIALIZATION_ERROR });
  }
}

export default function* root() {
  yield all([
    takeEvery(actionTypes.APP_INITIALIZE, initializeApp),
  ]);
}
