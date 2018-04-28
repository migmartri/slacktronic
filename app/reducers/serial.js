// @flow
import actionTypes from '../actions/actionTypes';
import SlacktronicSerialClient from '../lib/serialClient';
import type { serialMessage } from '../models/serialMessage';

const initialState = {
  client: null,
  messages: { byID: {}, allIDs: [], queue: [] }
};

type serialReduxStateType = {
  client: ?SlacktronicSerialClient,
  messages: {
    byID: { [string]: serialMessage },
    allIDs: string[],
    // List of ids to be processed
    queue: string[]
  }
};

function serial(state: serialReduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SERIAL_CLIENT_CREATING:
      return { ...state, client: null };
    case actionTypes.SERIAL_CLIENT_CREATED:
      return { ...state, client: action.client };
    case actionTypes.SERIAL_MESSAGE_ENQUEUE:
      return {
        ...state,
        messages: {
          ...state.messages,
          byID: {
            ...state.messages.byID, [action.data.ID]: action.data
          },
          allIDs: [...state.messages.allIDs, action.data.ID],
          queue: [...state.messages.queue, action.data.ID]
        }
      };
    default:
      return state;
  }
}

export default serial;
