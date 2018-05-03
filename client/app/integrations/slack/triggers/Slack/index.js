import { take, call, put, cancelled } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import actionTypes from '../../../../actions/actionTypes';
import * as slackActions from '../../../../actions/slack';
import * as subscriptionActions from '../../../../actions/subscriptions';
import SlackClient from '../../../../lib/slackClient';
import AwayTrigger from './Away/Away';
import DMTrigger from './DirectMessage/DirectMessage';
import MentionTrigger from './Mention/Mention';

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

function* initializeSubsriptions(client: SlackClient) {
  // Initialize a set of hardcoded subscriptions
  yield put(subscriptionActions.clearSubscriptions());

  yield put(subscriptionActions.createSubscription({
    slot: 'A', active: false, assertion: new AwayTrigger()
  }));

  yield put(subscriptionActions.createSubscription({
    slot: 'B', active: false, assertion: new DMTrigger(client.userInfo.userID)
  }));

  yield put(subscriptionActions.createSubscription({
    slot: 'C', active: false, assertion: new MentionTrigger(client.userInfo.userID)
  }));
}

function* watchSlackEventsTriggers(client: SlackClient) {
  const chan = yield call(slackEventsChannel, client);
  try {
    while (true) {
      const event = yield take(chan);
      yield put(slackActions.processSlackEvent(event));
      yield put(slackActions.slackEvent(event));
    }
  } finally {
    if (yield cancelled()) {
      chan.close();
    }
  }
}

function* rootSlackSaga() {
  const action = yield take(actionTypes.PROVIDER_INITIALIZED);
  const { client } = action.data.options;
  // TODO(miguel) This should be defined by the user and stored
  yield call(initializeSubsriptions, client);
  yield call(watchSlackEventsTriggers, client);
}

export default rootSlackSaga;
