// @flow
import shortID from 'shortid';
import type { ThunkAction, Action } from './common';
import actionTypes from './actionTypes';
import { enqueueMessage } from './serial';
import type { subscriptionTypeAttrs } from '../models/subscription';

export const createSubscription = (sub: subscriptionTypeAttrs): Action => ({
  type: actionTypes.SUBSCRIPTION_CREATE,
  data: { ID: shortID.generate(), ...sub }
});

export const changeSubscriptionState = (subID: string, active: boolean): Action => ({
  type: actionTypes.SUBSCRIPTION_STATUS_CHANGE,
  ID: subID,
  active
});

export const subscriptionStatusChange = (subID: string, active: boolean): ThunkAction => (
  (dispatch, getState) => {
    // TODO(miguel) Remove this duplicated state and use the result of the serial communication
    dispatch(changeSubscriptionState(subID, active));
    // Enqueue serial message
    const sub = getState().subscriptions.byID[subID];
    const message = active ? sub.slot.toUpperCase() : sub.slot.toLowerCase();
    dispatch(enqueueMessage(message, subID));
  }
);

export const clearSubscriptions = (): Action => ({
  type: actionTypes.SUBSCRIPTIONS_CLEAR,
});

export default createSubscription;
