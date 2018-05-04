import { fork } from 'redux-saga/effects';
import serialComActionsSaga from './integrations/serialCom/actions/';
import slackTriggersSaga from './integrations/slack/triggers';
import slackProviderSaga from './integrations/slack/providerSaga';
import serialComProviderSaga from './integrations/serialCom/providerSaga';
import subscriptionsSaga from './sagas/subscriptionsSaga';

const sagas = [
  // Providers
  slackProviderSaga,
  serialComProviderSaga,
  // Actions
  serialComActionsSaga,
  // Triggers
  slackTriggersSaga,
  // Misc
  subscriptionsSaga
];

export default function* root() {
  yield sagas.map(saga => fork(saga));
}
