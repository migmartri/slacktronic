// @flow
import actionTypes from '../actions/actionTypes';

const initialState = {
  initializationStatus: 'pending'
};

export type AppInitializationStatus = 'pending' | 'in-progress' | 'finished' | 'failed';
type reduxStateType = {
  initializationStatus: AppInitializationStatus
};

function providers(state: reduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.APP_INITIALIZE:
      return {
        initializationStatus: 'in-progress'
      };
    case actionTypes.APP_INITIALIZED:
      return {
        initializationStatus: 'finished'
      };
    case actionTypes.APP_INITIALIZATION_ERROR:
      return {
        initializationStatus: 'failed'
      };
    default:
      return state;
  }
}

export default providers;
