import { all } from 'redux-saga/effects';
import watchSerialMessages from './message/messageSaga';

export const AVAILABLE_SERIALCOM_ACTIONS = {
  message: 'TODO_ADD_CLASS'
};

export type supportedSerialComActionNames = $Keys<typeof AVAILABLE_SERIALCOM_ACTIONS>;

export default function* actionSaga() {
  yield all([
    watchSerialMessages()
  ]);
}
