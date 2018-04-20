// @flow
import type { Action } from './common';
import actionTypes from './actionTypes';
import type { subscriptionTypeAttrs } from '../models/subscription';

export const createSubscription = (sub: subscriptionTypeAttrs): Action => ({
  type: actionTypes.SUBSCRIPTION_CREATE,
  data: sub
});

export const subscriptionStatusChange = (subID: string, active: boolean): Action => ({
  type: actionTypes.SUBSCRIPTION_STATUS_CHANGE,
  ID: subID,
  active
});

export default createSubscription;
