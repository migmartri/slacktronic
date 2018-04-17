// @flow

import actionTypes from '../actions/actionTypes';
// import type { Action } from '../actions/common';

type tokenStateType = {
  +value?: string,
  +storing: boolean,
  +validating: boolean,
  +valid: boolean
};

export type userInfoType = {
  user: string,
  userID: string,
  team: string,
  teamID: string
};

export type slackStateType = {
  +token: tokenStateType,
  +userInfo?: userInfoType
};

const initialState: slackStateType = {
  token: {
    storing: false,
    validating: false,
    valid: false,
  }
};

export default function slack(state: slackStateType = initialState, action: any) {
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
    default:
      return state;
  }
}
