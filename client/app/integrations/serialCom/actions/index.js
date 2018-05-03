import { all } from 'redux-saga/effects';
import watchSerialMessages from './SerialCom/sendMessageSaga';

export default function* actionSaga() {
  yield all([
    watchSerialMessages()
  ]);
}
