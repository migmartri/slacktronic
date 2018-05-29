import shortID from 'shortid';
import { push } from 'react-router-redux';
import { take, all, call, put, fork } from 'redux-saga/effects';
import actionTypes from '../actions/actionTypes';
import { createSubscription } from './../actions/subscriptions';
import * as actionsActions from '../actions/actions';

const debug = require('debug')('slacktronic@subscriptions.saga');

const registeredSubscriptions = [];

function* watchDiskStoreLoaded() {
  while (true) {
    const payload = yield take(actionTypes.STORE_SNAPSHOT_RETRIEVED);
    const { subscriptions, actions, triggers } = payload.data;
    debug('Disk store loaded, creating subscriptions %o', payload);

    if (!subscriptions) {
      debug('There are not subscriptions to load');
      return;
    }

    const subscriptionIDS = Object.keys(subscriptions.byID);
    // Iterating on subscriptions keys to prevent inconsistency when relying in IDS of arrays
    for (let i = 0; i < subscriptionIDS.length; i += 1) {
      const subID = subscriptionIDS[i];
      const subscription = subscriptions.byID[subID];
      const action = actions.byID[subscription.actionID];
      const trigger = triggers.byID[subscription.triggerID];

      if (!subscription || !action || !trigger) {
        debug('Subscription or action or trigger not found', subscription, action, trigger);
        return;
      }

      debug('Dispatching the creation of action %o, trigger %o, subscription %o', action, trigger, subscription);

      yield put({
        type: actionTypes.TRIGGER_CREATE, data: { ...trigger, lastPerform: null }
      });

      yield put({
        type: actionTypes.ACTION_CREATE, data: { ...action }
      });

      const sub = yield put(createSubscription({ ...subscription }));
      if (!sub) return;

      registeredSubscriptions.push(sub.data);
      debug('Subscriptions registered %o', registeredSubscriptions);
    }
  }
}

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

    if (!sub) return;
    registeredSubscriptions.push(sub.data);

    debug('Subscriptions registered %o', registeredSubscriptions);
    // Store in disk
    yield put({
      type: actionTypes.STORE_SNAPSHOT_SAVE,
      keys: ['subscriptions', 'actions', 'triggers']
    });

    // Redirect to homepage
    yield put(push('/'));
  }
}

function* watchSubscriptionDeletion() {
  while (true) {
    const payload = yield take(actionTypes.SUBSCRIPTION_DELETE);
    const sub = payload.data;
    debug('Subscription deletion received %o', payload);
    const indexOfSubToDelete = registeredSubscriptions.findIndex(s => (
      s.ID === sub.ID
    ));

    if (indexOfSubToDelete !== -1) {
      registeredSubscriptions.splice(indexOfSubToDelete, 1);
      debug('registeredSubscriptions updated after deletion %o', registeredSubscriptions);

      yield put({
        type: actionTypes.ACTION_DELETE,
        data: { ID: sub.actionID }
      });

      yield put({
        type: actionTypes.TRIGGER_DELETE,
        data: { ID: sub.triggerID }
      });
    }
  }
}

function* processTrigger(trigger, subscription) {
  const triggerID = trigger.ID;
  const { enabled } = trigger.lastPerform;

  debug('Checking subscription %o on trigger %o', subscription, triggerID);
  if (triggerID === subscription.triggerID) {
    debug('Subscription %o contains trigger, dispatching action %o', subscription, subscription.actionID);
    yield put(actionsActions.perform(subscription.actionID, enabled));
  }
}

function* watchTriggeredTriggers() {
  while (true) {
    const trigger = yield take(actionTypes.TRIGGER_TRIGGERED);
    debug('Trigger received %o', trigger);
    yield all(registeredSubscriptions.map(sub => fork(processTrigger, trigger.data, sub)));
  }
}

export default function* root() {
  yield all([
    call(watchSubscriptionCreation),
    call(watchSubscriptionDeletion),
    call(watchDiskStoreLoaded),
    call(watchTriggeredTriggers)
  ]);
}
