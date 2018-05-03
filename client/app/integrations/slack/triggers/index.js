import { all } from 'redux-saga/effects';
import slackEventsTriggerSaga from './Slack';

export interface TriggerType {
  name: string;
  description?: string;
  shouldTrigger(any): boolean;
  triggerValue(any): boolean
}

export default function* triggersSaga() {
  yield all([
    slackEventsTriggerSaga()
  ]);
}
