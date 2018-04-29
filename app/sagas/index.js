import { all } from 'redux-saga/effects';
import watchSerialMessages from './serialSaga';

export default function* rootSaga() {
  yield all([
    watchSerialMessages()
  ]);
}
