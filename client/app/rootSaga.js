import { fork } from 'redux-saga/effects';
import serialComActionsSaga from './integrations/serialCom/actions/';
import slackTriggerSaga from './integrations/slack/triggers';
import slackProviderSaga from './integrations/slack/providerSaga';
import serialComProviderSaga from './integrations/serialCom/providerSaga';
import subscriptionsSaga from './sagas/subscriptionsSaga';
import diskStoreSaga from './sagas/diskStoreSaga';
import appInitSaga from './sagas/appInitializationSaga';

const sagas = [
  // Providers
  slackProviderSaga,
  serialComProviderSaga,
  // Actions
  serialComActionsSaga,
  // Triggers
  slackTriggerSaga,
  // Misc
  subscriptionsSaga,
  diskStoreSaga,
  appInitSaga
];

export default function* root() {
  yield sagas.map(saga => fork(saga));
}
