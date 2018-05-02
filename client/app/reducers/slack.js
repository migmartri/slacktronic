// @flow
import actionTypes from '../actions/actionTypes';
import * as slackModels from '../models/slack';
import rotatedEntries from './helpers';

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
    // Reduce the events
    case actionTypes.SLACK_EVENT:
      return {
        ...state,
        events: {
          ...state.events,
          byID: {
            ...rotatedEntries(state.events).byID, [action.data.ID]: action.data
          },
          allIDs: [...rotatedEntries(state.events).allIDs, action.data.ID]
        }
      };
    default:
      return state;
  }
}
