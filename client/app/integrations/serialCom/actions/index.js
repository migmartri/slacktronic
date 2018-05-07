import { all } from 'redux-saga/effects';
import watchSerialMessages from './message/messageSaga';
import message from './message';

export const AVAILABLE_SERIALCOM_ACTIONS = {
  message
};

export type supportedSerialComActionNames = $Keys<typeof AVAILABLE_SERIALCOM_ACTIONS>;

export default function* actionSaga() {
  yield all([
    watchSerialMessages()
  ]);
}
