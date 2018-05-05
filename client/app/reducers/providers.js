// @flow
import actionTypes from '../actions/actionTypes';
import type { providerType, supportedProviderName } from '../models/provider';

const initialState = {
  byName: {}, allNames: []
};

type reduxStateType = {
  byName: { [supportedProviderName]: providerType },
  allNames: string[]
};

// The providers are singleton for now.
function providers(state: reduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.PROVIDER_INITIALIZED:
      return {
        ...state,
        byName: {
          ...state.byName, [action.data.name]: action.data
        },
        allIDs: [...state.allNames, action.data.name]
      };
    default:
      return state;
  }
}

export default providers;
