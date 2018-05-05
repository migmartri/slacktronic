import shortID from 'shortid';
import { take, all, fork, put } from 'redux-saga/effects';
import actionTypes from '../actions/actionTypes';
import { createSubscription } from './../actions/subscriptions';

function* watchSubscriptionCreation() {
  while (true) {
    const payload = yield take(actionTypes.SUBSCRIPTION_CRAFT);

    const { trigger, action, enabled } = payload.data;
    const triggerInstance = yield put({
      type: actionTypes.TRIGGER_CREATE,
      data: { ID: shortID.generate(), ...trigger }
    });

    const actionInstance = yield put({
      type: actionTypes.ACTION_CREATE,
      data: { ID: shortID.generate(), ...action }
    });

    yield put(createSubscription({
      triggerID: triggerInstance.data.ID,
      actionID: actionInstance.data.ID,
      enabled
    }));
  }
}

export default function* root() {
  yield all([
    fork(watchSubscriptionCreation),
  ]);
}
