// @flow
import actionTypes from '../actions/actionTypes';
import * as subscriptionModel from '../models/subscription';

const initialState = {
  byID: {}, allIDs: []
};

export type subscriptionsReduxStateType = {
  byID: { [string]: subscriptionModel.subscriptionType },
  allIDs: string[]
};

function subscriptions(state: subscriptionsReduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SUBSCRIPTIONS_CLEAR:
      return initialState;
    case actionTypes.SUBSCRIPTION_CREATE:
      return {
        ...state,
        byID: {
          ...state.byID, [action.data.ID]: action.data
        },
        allIDs: [...state.allIDs, action.data.ID]
      };
    case actionTypes.SUBSCRIPTION_STATUS_CHANGE:
      return {
        ...state,
        byID: {
          ...state.byID, [action.ID]: { ...state.byID[action.ID], active: action.active }
        },
      };
    default:
      return state;
  }
}

export default subscriptions;
