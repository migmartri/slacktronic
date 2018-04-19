// @flow
import shortID from 'shortid';
import actionTypes from '../actions/actionTypes';
import * as subscriptionModel from '../models/subscription';

const initialState = [];

function subscriptions(state: subscriptionModel.subscriptionType[] = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SUBSCRIPTION_CREATE:
      return [...state, { id: shortID.generate(), ...action.data }];
    default:
      return state;
  }
}

export default subscriptions;
