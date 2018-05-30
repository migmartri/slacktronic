import { takeEvery, all, select, put } from 'redux-saga/effects';
import Store from 'electron-store';
import actionTypes from '../actions/actionTypes';

const configStore = new Store();
const debug = require('debug')('slacktronic@diskStore.saga');

function* writeInDisk(action) {
  const keysToSave = action.keys;
  const state = yield select();
  debug('write in disk request for keys %o, state %o', keysToSave, state);

  keysToSave.forEach(keyName => {
    debug('Writing %o, under key %o', state[keyName], keyName);
    configStore.set(keyName, state[keyName]);
  });
}

function* retrieveFromDisk() {
  debug('retrieve from disk request');
  const sn = configStore.get();
  yield put({ type: actionTypes.STORE_SNAPSHOT_RETRIEVED, data: sn });
}

export default function* root() {
  yield all([
    takeEvery(actionTypes.STORE_SNAPSHOT_SAVE, writeInDisk),
    takeEvery(actionTypes.STORE_SNAPSHOT_RETRIEVE, retrieveFromDisk),
  ]);
}
