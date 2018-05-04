import shortID from 'shortid';
import { take, all, fork, put } from 'redux-saga/effects';
import actionTypes from '../actions/actionTypes';
import { createSubscription } from './../actions/subscriptions';

// const debug = require('debug')('slacktronic@subscriptionSaga')

function* watchSubscriptionCreation() {
  while (true) {
    const payload = yield take(actionTypes.SUBSCRIPTION_CRAFT);

    const trigger = yield put({
      type: actionTypes.TRIGGER_CREATE,
      data: { ID: shortID.generate(), ...payload.data.trigger }
    });

    const action = yield put({
      type: actionTypes.ACTION_CREATE,
      data: { ID: shortID.generate(), ...payload.data.action }
    });

    yield put(createSubscription({ triggerID: trigger.data.ID, actionID: action.data.ID }));
  }
}

export default function* root() {
  yield all([
    fork(watchSubscriptionCreation),
  ]);
}
