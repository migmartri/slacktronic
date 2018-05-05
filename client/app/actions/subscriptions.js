// @flow
import shortID from 'shortid';
import type { Action } from './common';
import actionTypes from './actionTypes';
import type { subscriptionTypeAttrs, } from '../models/subscription';
import type { actionAttrs } from '../models/action';
import type { triggerAttrs } from '../models/trigger';

type craftSubPayload = {
  trigger: triggerAttrs,
  action: actionAttrs,
  enabled: boolean
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

export const clearSubscriptions = (): Action => ({
  type: actionTypes.SUBSCRIPTIONS_CLEAR,
});

export default createSubscription;
