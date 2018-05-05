import { all } from 'redux-saga/effects';
import slackRTMSaga from './rtm/rtmSaga';

export interface TriggerType {
  name: string;
  description?: string;
  shouldTrigger(any): boolean;
  triggerValue(any): boolean
}

export default function* triggersSaga() {
  yield all([
    slackRTMSaga()
  ]);
}
