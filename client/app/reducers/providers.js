// @flow
import actionTypes from '../actions/actionTypes';
import type { providerType } from '../models/provider';

const initialState = {
  byID: {}, allIDs: []
};

type reduxStateType = {
  byID: { [string]: providerType },
  allIDs: string[]
};

function providers(state: reduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.PROVIDER_INITIALIZED:
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
