// @flow
import actionTypes from '../actions/actionTypes';
import SlacktronicSerialClient from '../lib/serialClient';

const initialState = {
  client: null
};

type serialReduxStateType = {
  client: ?SlacktronicSerialClient
};

function serial(state: serialReduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SERIAL_CLIENT_CREATING:
      return { ...state, client: null };
    case actionTypes.SERIAL_CLIENT_CREATED:
      return { ...state, client: action.client };
    default:
      return state;
  }
}

export default serial;
