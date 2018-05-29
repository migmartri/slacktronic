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
    case actionTypes.TRIGGER_TRIGGERED:
      return {
        ...state,
        byID: {
          ...state.byID,
          [action.data.ID]: {
            ...state.byID[action.data.ID],
            lastPerform: action.data.lastPerform
          }
        }
      };
    case actionTypes.TRIGGER_DELETE:
      const allTriggers = Object.assign({}, state.byID);
      delete allTriggers[action.data.ID];

      return {
        ...state,
        byID: allTriggers,
        allIDs: state.allIDs.filter(ID => action.data.ID !== ID)
      };
    default:
      return state;
  }
}

export default providers;
