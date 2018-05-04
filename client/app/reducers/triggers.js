// @flow
import actionTypes from '../actions/actionTypes';
import type { triggerType } from '../models/trigger';

const initialState = {
  byID: {}, allIDs: []
};

type reduxStateType = {
  byID: { [string]: triggerType },
  allIDs: string[]
};

// The providers are singleton for now.
function providers(state: reduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.TRIGGER_CREATE:
      return {
        ...state,
        byID: {
          ...state.byID, [action.data.ID]: action.data
        },
        allIDs: [...state.allIDs, action.data.ID]
      };
    default:
      return state;
  }
}

export default providers;
