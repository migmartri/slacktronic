import { takeEvery, fork, all, take, call, put, cancelled } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import actionTypes from '../../../../actions/actionTypes';
import * as slackActions from '../../../../actions/slack';
import SlackClient from '../../../../lib/slackClient';
import SUPPORTED_TRIGGERS from './index';

const debug = require('debug')('slacktronic@triggers.slack.rtm.saga');

const PROVIDER_NAME = 'slack';

function slackEventsChannel(client: SlackClient) {
  const { rtmClient } = client;

  // Creates a channel and start emitting events through it
  return eventChannel(emitter => {
    rtmClient.start();
    rtmClient.on('message', (event) => {
      emitter(event);
    });

    rtmClient.on('im_marked', (event) => {
      emitter(event);
    });

    rtmClient.on('channel_marked', (event) => {
      emitter(event);
    });

    // We subscribe to the current User
    rtmClient.subscribePresence([client.userInfo.userID]);

    rtmClient.on('presence_change', (event) => {
      emitter(event);
    });
    const unsubscribe = () => {
      rtmClient.disconnect();
      emitter(END);
    };
    return unsubscribe;
  });
}

// function* initializeSubsriptions(client: SlackClient) {
//   // Initialize a set of hardcoded subscriptions
//   yield put(subscriptionActions.clearSubscriptions());
//
//   // yield put(subscriptionActions.createSubscription({
//   //   slot: 'A', active: false, assertion: new AwayTrigger()
//   // }));
//
//   // yield put(subscriptionActions.createSubscription({
//   //   slot: 'B', active: false, assertion: new DMTrigger(client.userInfo.userID)
//   // }));
//
//   // yield put(subscriptionActions.createSubscription({
//   //   slot: 'C', active: false, assertion: new MentionTrigger(client.userInfo.userID)
//   // }));
// }

function processSlackEvents(event) {
  registeredTriggers.forEach(t => {
    debug('Processing event %j on trigger %j', event, t);
    const triggerType = SUPPORTED_TRIGGERS[t.type];
    debug('Loading triggerType %o', triggerType);
  });
}

function* watchSlackEventsTriggers(client: SlackClient) {
  // Subscribe to the channel
  const chan = yield call(slackEventsChannel, client);
  debug('Subscribed to events channel %o', chan);

  try {
    while (true) {
      const event = yield take(chan);
      debug('Events received from channel %o', event);
      yield fork(processSlackEvents, event);
      yield put(slackActions.slackEvent(event));
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}

const registeredTriggers = [];

function watchSlackTriggersCreation(action) {
  const { providerName } = action.data;

  if (providerName !== PROVIDER_NAME) return;
  debug('Received trigger creation', action);
  registeredTriggers.push(action.data);
  debug('Triggers registed %o', registeredTriggers);
}

function* watchProviderInitialized() {
  while (true) {
    const action = yield take(actionTypes.PROVIDER_INITIALIZED);
    debug('Provider initialize received', action);
    const { name } = action.data;
    if (name !== PROVIDER_NAME) continue;
    debug('Provider initialize accepted', action);

    const { client } = action.data.options;
    yield call(watchSlackEventsTriggers, client);
  }
}

function* rootSlackSaga() {
  yield all([
    call(watchProviderInitialized),
    takeEvery(actionTypes.TRIGGER_CREATE, watchSlackTriggersCreation)
  ]);
}

export default rootSlackSaga;
