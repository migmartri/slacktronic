// @flow
import actionTypes from '../actions/actionTypes';

type actionType = {
  +type: string
};

type slackStateType = {
  token?: string,
  fetching: boolean
};

const initialState: slackStateType = {
  fetching: false
};

export default function slack(state: slackStateType = initialState, action: actionType) {
  switch (action.type) {
    case actionTypes.SLACK_TOKEN_STORING:
      return { ...state, fetching: true };
    case actionTypes.SLACK_TOKEN_STORED:
      return { ...state, fetching: false, token: action.token };
    default:
      return { ...state, fetching: false };
  }
}
