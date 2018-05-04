// @flow
import shortID from 'shortid';
import type { ThunkAction, Action } from './common';
import actionTypes from './actionTypes';
import { enqueueMessage } from './serial';
import type { subscriptionTypeAttrs, subscriptionType } from '../models/subscription';
import type { actionAttrs } from '../models/action';
import type { triggerAttrs } from '../models/trigger';

type craftSubPayload = {
  trigger: triggerAttrs,
   action: actionAttrs
};

// Creates a subscription and its relationships, trigger and action
export const craftSubscription = (payload: craftSubPayload): Action => ({
  type: actionTypes.SUBSCRIPTION_CRAFT,
  data: payload
});

export const createSubscription = (sub: subscriptionTypeAttrs): Action => ({
  type: actionTypes.SUBSCRIPTION_CREATE,
  data: { ID: shortID.generate(), ...sub }
});

export const changeSubscriptionState = (subID: string, active: boolean): Action => ({
  type: actionTypes.SUBSCRIPTION_STATUS_CHANGE,
  ID: subID,
  active
});

export const subscriptionStatusChange = (sub: subscriptionType, active: boolean): ThunkAction => (
  (dispatch) => {
    // TODO(miguel) Remove this duplicated state and use the result of the serial communication
    dispatch(changeSubscriptionState(sub.ID, active));
    // Enqueue serial message
    // $FlowFixMe
    const message = active ? sub.slot.toUpperCase() : sub.slot.toLowerCase();
    dispatch(enqueueMessage(message, sub.ID));
  }
);

export const clearSubscriptions = (): Action => ({
  type: actionTypes.SUBSCRIPTIONS_CLEAR,
});

export default createSubscription;
