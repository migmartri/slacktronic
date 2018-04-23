// @flow
import actionTypes from '../actions/actionTypes';
import * as slackModels from '../models/slack';

export type slackReduxStateType = {
  +token: slackModels.tokenStateType,
  +userInfo?: slackModels.userInfoType,
  +events: {
    byID: { [string]: slackModels.eventType },
    allIDs: string[]
  }
};

const initialState: slackReduxStateType = {
  token: {
    storing: false,
    validating: false,
    valid: false,
  },
  events: { byID: {}, allIDs: [] }
};

const EVENTS_MAX_NUMBER = 10;

// Returns the EVENTS_MAX_NUMBER limiting the number of events
// that we store in the redux store
const rotatedEvents = (state) => {
  const eventIDs = [...state.events.allIDs];
  const eventsByID = { ...state.events.byID };

  if (eventIDs.length >= EVENTS_MAX_NUMBER) {
    const toRemove = eventIDs.shift();
    delete eventsByID[toRemove];
  }
  return { byID: eventsByID, allIDs: eventIDs };
};

export default function slack(state: slackReduxStateType = initialState, action: any) {
  switch (action.type) {
    case actionTypes.SLACK_TOKEN_STORING:
      return { ...state, token: { ...state.token, storing: true } };
    case actionTypes.SLACK_TOKEN_STORED:
      return { ...state, token: { ...state.token, storing: false, value: action.token } };
    case actionTypes.SLACK_TOKEN_VALIDATING:
      return { ...state, token: { ...state.token, validating: true } };
    case actionTypes.SLACK_TOKEN_VALIDATION_OK:
      return {
        ...state,
        token: {
          ...state.token, validating: false, valid: true, value: action.token
        }
      };
    case actionTypes.SLACK_TOKEN_VALIDATION_KO:
      return {
        ...state,
        token: {
          ...state.token, validating: false, valid: false
        }
      };
    case actionTypes.SLACK_USER_INFO_FETCH_OK:
      return { ...state, userInfo: action.userInfo };
    case actionTypes.SLACK_CLIENT_CREATING:
      return { ...state, client: null };
    case actionTypes.SLACK_CLIENT_CREATED:
      return { ...state, client: action.client };
    // Reduce the events
    case actionTypes.SLACK_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          byID: {
            ...rotatedEvents(state).byID, [action.data.ID]: action.data
          },
          allIDs: [...rotatedEvents(state).allIDs, action.data.ID]
        }
      };
    default:
      return state;
  }
}
