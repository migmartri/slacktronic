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
function* processSlackEvent(event) {
  yield all(registeredTriggers.map(t => call(processTrigger, event, t)));
}

// This will contain the list of initialized triggers so they can keep state between calls
const initializedTriggers = {};

function* processTrigger(event, t) {
  const TriggerTypeClass = AVAILABLE_SLACK_TRIGGERS[t.type];
  if (!TriggerTypeClass) {
    debug('Trigger type not found, skipping');
    return;
  }

  let trigger = initializedTriggers[t.ID];
  if (!trigger) {
    trigger = new TriggerTypeClass(t.options);
    initializedTriggers[t.ID] = trigger;
    debug('Initialized trigger not found, initializing %o', trigger);
  } else {
    debug('Loading initialized trigger from cache %o', trigger);
  }

  debug('Processing event %o on trigger %o', event, trigger);
  if (trigger.shouldTrigger(event)) {
    yield put(triggersActions.triggered(t.ID, trigger.triggerValue(event), trigger.debounceTime));
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
      yield fork(processSlackEvent, event);
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

function watchSlackTriggersDeletion(action) {
  debug('Received trigger deletion', action);
  const { ID: triggerID } = action.data;

  const indexToDelete = registeredTriggers.findIndex(t => (
    t.ID === triggerID
  ));

  if (indexToDelete !== -1) {
    registeredTriggers.splice(indexToDelete, 1);
    debug('registeredTriggers updated after deletion %o', registeredTriggers);
  }
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
    takeEvery(actionTypes.TRIGGER_CREATE, watchSlackTriggersCreation),
    takeEvery(actionTypes.TRIGGER_DELETE, watchSlackTriggersDeletion)
  ]);
}

export default rootSlackSaga;
