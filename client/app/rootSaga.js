import { fork } from 'redux-saga/effects';
import serialComActionsSaga from './integrations/serialCom/actions/';
import slackTriggersSaga from './integrations/slack/triggers';
import slackProviderSaga from './integrations/slack/providerSaga';
import serialComProviderSaga from './integrations/serialCom/providerSaga';

const sagas = [
  serialComActionsSaga,
  slackTriggersSaga,
  slackProviderSaga,
  serialComProviderSaga
];

export default function* root() {
  yield sagas.map(saga => fork(saga)); 
}