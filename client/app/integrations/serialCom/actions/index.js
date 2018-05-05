import { all } from 'redux-saga/effects';
import watchSerialMessages from './sendMessage/sendMessageSaga';

export default function* actionSaga() {
  yield all([
    watchSerialMessages()
  ]);
}
