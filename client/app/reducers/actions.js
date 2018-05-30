// @flow
import actionTypes from '../actions/actionTypes';
import type { actionType } from '../models/action';

const initialState = {
  byID: {}, allIDs: []
};

type reduxStateType = {
  byID: { [string]: actionType },
  allIDs: string[]
};

// The providers are singleton for now.
function providers(state: reduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.ACTION_CREATE:
      return {
        ...state,
        byID: {
          ...state.byID, [action.data.ID]: action.data
        },
        allIDs: [...state.allIDs, action.data.ID]
      };
    case actionTypes.ACTION_DELETE:
      const allActions = Object.assign({}, state.byID);
      delete allActions[action.data.ID];

      return {
        ...state,
        byID: allActions,
        allIDs: state.allIDs.filter(ID => action.data.ID !== ID)
      };
    default:
      return state;
  }
}

export default providers;
