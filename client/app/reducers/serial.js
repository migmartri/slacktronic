// @flow
import actionTypes from '../actions/actionTypes';
import type { serialMessage } from '../models/serialMessage';
import rotatedEntries from './helpers';

const initialState = {
  messages: { byID: {}, allIDs: [], queue: [] }
};

type serialReduxStateType = {
  messages: {
    byID: { [string]: serialMessage },
    allIDs: string[]
  }
};

function serial(state: serialReduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SERIAL_MESSAGE_CREATE:
      return {
        ...state,
        messages: {
          ...state.messages,
          byID: {
            ...rotatedEntries(state.messages).byID, [action.data.ID]: action.data
          },
          allIDs: [...rotatedEntries(state.messages).allIDs, action.data.ID],
        }
      };
    case actionTypes.SERIAL_MESSAGE_UPDATE:
      return {
        ...state,
        messages: {
          ...state.messages,
          byID: {
            ...state.messages.byID,
            [action.ID]: { ...state.messages.byID[action.ID], ...action.data }
          },
        },
      };
    default:
      return state;
  }
}

export default serial;
