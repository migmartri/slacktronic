import { takeEvery, fork, all, take, call, put, cancelled } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import actionTypes from '../../../../actions/actionTypes';
import * as slackActions from '../../../../actions/slack';
import * as triggersActions from '../../../../actions/triggers';
import SlackClient from '../../client';
import { AVAILABLE_SLACK_TRIGGERS } from '../index';
import { AVAILABLE_PROVIDERS } from '../../../index';

const debug = require('debug')('slacktronic@triggers.slack.rtm.saga');

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

// TODO(miguel) Initialize Trigger classes in watchSlackTrigger generator
// and remove client from here.
function* processSlackEvent(event, client: SlackClient) {
  yield all(registeredTriggers.map(t => call(processTrigger, event, client, t)));
}

function* processTrigger(event, client, t) {
  const TriggerTypeClass = AVAILABLE_SLACK_TRIGGERS[t.type];
  if (!TriggerTypeClass) {
    debug('Trigger type not found, skipping');
    return;
  }

  let trigger;
  if (t.type === 'mention' || t.type === 'dm') {
    trigger = new TriggerTypeClass(client.userInfo.userID);
  } else {
    trigger = new TriggerTypeClass();
  }

  debug('Processing event %o on trigger %o', event, trigger);
  if (trigger.shouldTrigger(event)) {
    yield put(triggersActions.triggered(t.ID, trigger.triggerValue(event)));
    debug('Triggering %o', trigger);
  }
}

function* watchSlackEventsTriggers(client: SlackClient) {
  // Subscribe to the channel
  const chan = yield call(slackEventsChannel, client);
  debug('Subscribed to events channel %o', chan);

  try {
    while (true) {
      const event = yield take(chan);
      debug('Events received from channel %o', event);
      yield fork(processSlackEvent, event, client);
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

  if (providerName !== AVAILABLE_PROVIDERS.slack) return;
  debug('Received trigger creation', action);
  registeredTriggers.push(action.data);
  debug('Triggers registered %o', registeredTriggers);
}

function* watchProviderInitialized() {
  while (true) {
    const action = yield take(actionTypes.PROVIDER_INITIALIZED);
    debug('Provider initialize received %o', action);
    const { name } = action.data;
    if (name !== AVAILABLE_PROVIDERS.slack) continue;
    debug('Provider initialize accepted %o', action);

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
