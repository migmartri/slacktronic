import shortID from 'shortid';
import { take, all, call, put } from 'redux-saga/effects';
import actionTypes from '../actions/actionTypes';
import { createSubscription } from './../actions/subscriptions';
import * as actionsActions from '../actions/actions';

const debug = require('debug')('slacktronic@subscriptions.saga');

const registeredSubscriptions = [];
function* watchSubscriptionCreation() {
  while (true) {
    const payload = yield take(actionTypes.SUBSCRIPTION_CRAFT);
    debug('SubscriptionCraft payload received %o', payload);

    const { trigger, action, enabled } = payload.data;
    const triggerInstance = yield put({
      type: actionTypes.TRIGGER_CREATE,
      data: { ID: shortID.generate(), ...trigger }
    });

    const actionInstance = yield put({
      type: actionTypes.ACTION_CREATE,
      data: { ID: shortID.generate(), ...action }
    });

    const sub = yield put(createSubscription({
      triggerID: triggerInstance.data.ID,
      actionID: actionInstance.data.ID,
      enabled
    }));

    registeredSubscriptions.push(sub);
    debug('Subscriptions registed %o', registeredSubscriptions);
  }
}

function* processTrigger(triggerID: string, subscription) {
  debug('Checking subscription %o on trigger %o', subscription, triggerID);
  if (triggerID === subscription.triggerID) {
    debug('Subscription %o contains trigger, dispatching action %o', subscription, subscription.actionID);
    yield put(actionsActions.perform(subscription.actionID, 'TODO'));
  }
}

function* watchTriggeredTriggers() {
  while (true) {
    const trigger = yield take(actionTypes.TRIGGER_TRIGGERED);
    debug('Trigger received %o', trigger);
    yield all(registeredSubscriptions.map(sub => call(processTrigger, trigger.data.ID, sub.data)));
  }
}

export default function* root() {
  yield all([
    call(watchSubscriptionCreation),
    call(watchTriggeredTriggers)
  ]);
}
